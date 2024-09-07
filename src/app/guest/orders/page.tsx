import OrdersCart from "@/app/guest/orders/orders-cart"

const OrdersPage = () => {
  return (
    <div className='max-w-[400px] mx-auto space-y-4'>
      <h1 className='text-center text-xl font-bold'>📜 Đơn hàng</h1>
      <OrdersCart/>
    </div>
  )
}

export default OrdersPage