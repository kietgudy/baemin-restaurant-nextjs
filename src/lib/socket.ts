
import envConfig from "@/config";
import { io } from "socket.io-client";
import { getAccessTokenFromLocalStorage } from "@/lib/utils";

const socket = io(envConfig.NEXT_PUBLIC_BACKEND_URL, {
  auth: {
    Authorization: `Bearer ${getAccessTokenFromLocalStorage()}`,
  },
});
export default socket;
