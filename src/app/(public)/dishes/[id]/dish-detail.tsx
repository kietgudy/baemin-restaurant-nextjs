import { formatCurrency } from "@/lib/utils";
import { DishResType } from "@/schemaValidations/dish.schema";
import Image from "next/image";

export default async function DishDetail({
  dish,
}: {
  dish: DishResType["data"] | undefined;
}) {
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
      <p className="font-semibold">Giá tiền: {formatCurrency(dish.price)}</p>
      <Image
        src={dish.image}
        width={150}
        height={150}
        quality={100}
        alt={dish.name}
        className="object-cover w-full h-full max-w-[1080px] max-h-[1080px] rounded-md"
      />

      <p className="text-lg lg:text-xl">{dish.description}</p>
    </div>
  );
}
