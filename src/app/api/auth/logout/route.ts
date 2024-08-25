import authApiRequest from "@/apiRequests/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  cookieStore.delete("accessToken")
  cookieStore.delete("refreshToken")
  if(!accessToken || !refreshToken) {
    return Response.json({
      message: 'Token không hợp lệ'
    }, {
      status: 200
    })
  }
  try {
    const result = await authApiRequest.serverLogout({
        accessToken, refreshToken
    })
    return Response.json(result.payload)
  } catch (error) {
   return Response.json({
        message: 'Đã có lỗi xảy ra'
        }, {
        status: 200
   })
  }
}
