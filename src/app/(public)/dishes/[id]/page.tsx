import dishApiRequest from "@/apiRequests/dish";
import { formatCurrency, wrapApiServer } from "@/lib/utils";
import Image from "next/image";

export default async function DishPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const data = await wrapApiServer(() => dishApiRequest.getDish(Number(id)));
  const dish = data?.payload?.data;
  if (!dish)
    return (
      <div>
        <h2 className="text-2xl lg:text-3xl font-semibold">
          Món ăn không tồn tại
        </h2>
      </div>
    );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl lg:text-3xl font-semibold">{dish.name}</h1>
      <p className="font-semibold">Price: {formatCurrency(dish.price)}</p>
      <Image
        src={dish.image}
        width={650}
        height={650}
        quality={100}
        alt={dish.name}
        className="object-cover w-full h-full max-w-[1080px] max-h-[1080px] rounded-md"
      />
      <p className="text-lg lg:text-xl">{dish.description}</p>
    </div>
  );
}
