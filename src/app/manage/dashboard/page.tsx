import accountApiRequest from "@/apiRequests/account"
import { cookies } from "next/headers"

const DashBoard = async () => {
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')?.value!
  let name = ''
  const result = await accountApiRequest.serverMe(accessToken)
  name = result.payload.data.name
  return (
    <div>DashBoard {name}</div>
  )
}

export default DashBoard