"use client";

import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { OrderStatus } from "@/constants/type";
import socket from "@/lib/socket";
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import { useGuestOrderListQuery } from "@/queries/useGuest";
import { PayGuestOrdersResType, UpdateOrderResType } from "@/schemaValidations/order.schema";
import Image from "next/image";
import { useEffect, useMemo } from "react";

const OrdersCart = () => {
  const { data, refetch } = useGuestOrderListQuery();
  const orders = useMemo(() => data?.payload.data ?? [], [data]);
  const { notPaid, paid } = useMemo(() => {
    return orders.reduce(
      (total, order) => {
        if (
          order.status === OrderStatus.Delivered ||
          order.status === OrderStatus.Processing ||
          order.status === OrderStatus.Pending
        ) {
          return {
            ...total,
            notPaid: {
              price:
                total.notPaid.price + order.dishSnapshot.price * order.quantity,
              quantity: total.notPaid.quantity + order.quantity,
            },
          };
        }
        if (order.status === OrderStatus.Paid) {
          return {
            ...total,
            paid: {
              price:
                total.paid.price + order.dishSnapshot.price * order.quantity,
              quantity: total.paid.quantity + order.quantity,
            },
          };
        }
        return total;
      },
      {
        notPaid: {
          price: 0,
          quantity: 0,
        },
        paid: {
          price: 0,
          quantity: 0,
        },
      }
    );
  }, [orders]);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {}

    function onDisconnect() {
      console.log("disconnected");
    }

    function onUpdateOrder(data: UpdateOrderResType["data"]) {
      const {
        dishSnapshot: { name },
        quantity,
      } = data;
      toast({
        description: `Món ${name} (SL: ${quantity}) ${getVietnameseOrderStatus(
          data.status
        )}`,
      });
      refetch();
    }


    function onPayment(data: PayGuestOrdersResType["data"]) {
      const { guest } = data[0];
      toast({
        description: `Bạn vừa thanh toán thành công ${data.length} đơn`,
      });
      refetch();
    }

    socket.on("update-order", onUpdateOrder);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("payment", onPayment);


    return () => {
      socket.off("update-order", onUpdateOrder);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("payment", onPayment);

    };
  }, [refetch]);
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
      {paid.quantity !== 0 && (
        <div className="sticky bottom-0 bg-white p-3 rounded-2xl shadow-md flex justify-between items-center border-t border-gray-200">
          <span className="text-lg font-semibold text-gray-700">
            Đơn đã thanh toán · {paid.quantity} món
          </span>
          <span className="text-lg ml-2 font-semibold text-blue-600">
            {formatCurrency(paid.price)}
          </span>
        </div>
      )}
      <div className="sticky bottom-0 bg-white p-3 rounded-2xl shadow-md flex justify-between items-center border-t border-gray-200">
        <span className="text-lg font-semibold text-gray-700">
          Đơn chưa thanh toán · {notPaid.quantity} món
        </span>
        <span className="text-lg ml-2 font-semibold text-blue-600">
          {formatCurrency(notPaid.price)}
        </span>
      </div>
    </>
  );
};

export default OrdersCart;
