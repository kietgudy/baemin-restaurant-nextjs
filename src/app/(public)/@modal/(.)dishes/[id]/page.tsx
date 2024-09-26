import dishApiRequest from "@/apiRequests/dish";
import { wrapApiServer } from "@/lib/utils";
import Modal from "./modal";
import DishDetail from "../../../dishes/[id]/dish-detail";

export default async function DishPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const data = await wrapApiServer(() => dishApiRequest.getDish(Number(id)));
  const dish = data?.payload?.data;
  return (
    <Modal>
      <DishDetail dish={dish} />
    </Modal>
  );
}
