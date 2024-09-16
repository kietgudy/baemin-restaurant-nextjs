import guestApiRequest from "@/apiRequests/guest";
import orderApiRequest from "@/apiRequests/order";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGuestLoginMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.clientLogin,
  });
};

export const useGuestLogoutMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.clientLogout,
  });
};

export const useGuestOrderMutation = () => {
  return useMutation({ mutationFn: guestApiRequest.order });
};

export const useGuestOrderListQuery = () => {
  return useQuery({
    queryFn: guestApiRequest.getOrderList,
    queryKey: ["guest-orders"]
  })
}
export const useCreateOrderMutation = () => {
  return useMutation({
    mutationFn: orderApiRequest.createOrders,
  })
}