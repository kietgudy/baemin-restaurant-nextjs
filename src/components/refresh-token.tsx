"use client";

import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequests/auth";

// Những page sau sẽ không check refesh token
const UNAUTHENTICATED_PATH = ["/login", "/logout", "/refresh-token"];
export default function RefreshToken() {
  const pathname = usePathname();
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
      const now = Math.round(new Date().getTime() / 1000);
      if (decodedRefreshToken.exp <= now) return;
      if (
        decodedAccessToken.exp - now <
        (decodedAccessToken.exp - decodedAccessToken.iat) / 3
      ) {
        // Call refresh token
        try {
            const res = await authApiRequest.clientRefreshToken();
            setAccessTokenToLocalStorage(res.payload.data.accessToken);
            setRefreshTokenToLocalStorage(res.payload.data.refreshToken);
        } catch (error) {
            clearInterval(interval);
        }
      }
    };
    checkAndRefreshToken();
    interval = setInterval(checkAndRefreshToken, 1000);
    return () => clearInterval(interval);
  }, [pathname]);
  return null;
}
