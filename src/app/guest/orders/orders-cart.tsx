"use client";

import { Badge } from "@/components/ui/badge";
import socket from "@/lib/socket";
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import { useGuestOrderListQuery } from "@/queries/useGuest";
import { UpdateOrderResType } from "@/schemaValidations/order.schema";
import Image from "next/image";
import { useEffect, useMemo } from "react";

const OrdersCart = () => {
  const { data, refetch } = useGuestOrderListQuery();
  const orders = useMemo(() => data?.payload.data ?? [], [data]);
  const totalPrice = useMemo(() => {
    return orders.reduce((total, order) => {
      return total + order.dishSnapshot.price * order.quantity;
    }, 0);
  }, [orders]);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {}

    function onDisconnect() {}

    function onUpdateOrder(data: UpdateOrderResType['data']) {
      refetch();
    }
    
    socket.on("update-order", onUpdateOrder);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);
  return (
    <>
      {orders.map((order, index) => (
        <div key={order.id} className="flex items-center gap-4">
          <span>{index + 1}</span>
          <div className="flex-shrink-0 relative">
            <Image
              src={order.dishSnapshot.image}
              alt={order.dishSnapshot.name}
              height={100}
              width={100}
              quality={100}
              className="object-cover w-[80px] h-[80px] rounded-md"
            />
          </div>
          <div className="space-y-2 flex flex-col justify-between">
            <h3 className="text-base font-medium">{order.dishSnapshot.name}</h3>
            <p className="text-sm font-semibold ">
              {formatCurrency(order.dishSnapshot.price)}{" "}
              <span className="mx-2">x</span>
              <Badge className="px-1 w-5 h-5 rounded-full justify-center text-sm">
                {order.quantity}
              </Badge>
            </p>
          </div>
          <div className="flex-shrink-0 ml-auto flex justify-center items-center">
            <Badge variant={"secondary"}>
              {getVietnameseOrderStatus(order.status)}
            </Badge>
          </div>
        </div>
      ))}
      <div className="sticky bottom-0 bg-white p-3 rounded-2xl shadow-md flex justify-between items-center border-t border-gray-200">
        <span className="text-lg font-semibold text-gray-700">
          Tổng tiền · {orders.length} món
        </span>
        <span className="text-lg ml-2 font-semibold text-blue-600">
          {formatCurrency(totalPrice)}
        </span>
      </div>
    </>
  );
};

export default OrdersCart;
