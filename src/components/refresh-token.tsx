"use client";

import {
  decodeToken,
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  removeTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequests/auth";
import { Role } from "@/constants/type";
import guestApiRequest from "@/apiRequests/guest";

// Những page sau sẽ không check refesh token
const UNAUTHENTICATED_PATH = ["/login", "/logout", "/refresh-token"];
export default function RefreshToken() {
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;
    let interval: any = null;
    const checkAndRefreshToken = async () => {
      const accessToken = getAccessTokenFromLocalStorage();
      const refreshToken = getRefreshTokenFromLocalStorage();
      if (!accessToken || !refreshToken) return;
      const decodedAccessToken = jwt.decode(accessToken) as {
        exp: number;
        iat: number;
      };
      const decodedRefreshToken = jwt.decode(refreshToken) as {
        exp: number;
        iat: number;
      };
      const now = new Date().getTime() / 1000 - 1;
      //Refresh token hết hạn => logout
      if (decodedRefreshToken.exp <= now) {
        removeTokenFromLocalStorage();
        router.push("/login");
        return;
      }
      if (
        decodedAccessToken.exp - now <
        (decodedAccessToken.exp - decodedAccessToken.iat) / 3
      ) {
        // Call refresh token
        try {
          const role = decodeToken(refreshToken).role;
          const res =
            role === Role.Guest
              ? await guestApiRequest.clientRefreshToken()
              : await authApiRequest.clientRefreshToken();
          setAccessTokenToLocalStorage(res.payload.data.accessToken);
          setRefreshTokenToLocalStorage(res.payload.data.refreshToken);
        } catch (error) {
          clearInterval(interval);
          removeTokenFromLocalStorage();
          router.push("/login");
        }
      }
    };
    checkAndRefreshToken();
    interval = setInterval(checkAndRefreshToken, 1000);
    return () => clearInterval(interval);
  }, [pathname, router]);
  return null;
}
