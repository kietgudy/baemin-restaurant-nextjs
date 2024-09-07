import http from "@/lib/http";
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
} from "@/schemaValidations/auth.schema";
import { GuestCreateOrdersBodyType, GuestCreateOrdersResType, GuestGetOrdersResType, GuestLoginBodyType, GuestLoginResType } from "@/schemaValidations/guest.schema";

const guestApiRequest = {
  refreshTokenRequest: null as Promise<{
    status: number;
    payload: RefreshTokenResType;
  }> | null,
  serverLogin: (body: GuestLoginBodyType) =>
    http.post<GuestLoginResType>("/guest/auth/login", body),
  clientLogin: (body: GuestLoginBodyType) =>
    http.post<GuestLoginResType>("/api/guest/auth/login", body, {
      baseUrl: "",
    }),
  serverLogout: (body: LogoutBodyType & { accessToken: string }) =>
    http.post(
      "/guest/auth/logout",
      {
        refreshToken: body.refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      }
    ),
  clientLogout: () =>
    http.post("/api/guest/auth/logout", null, {
      baseUrl: "",
    }),
  serverRefreshToken: (body: RefreshTokenBodyType) =>
    http.post<RefreshTokenResType>("/guest/auth/refresh-token", body),
  async clientRefreshToken() {
    //Tránh duplicate request
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest;
    }
    this.refreshTokenRequest = http.post<RefreshTokenResType>(
      "/api/guest/auth/refresh-token",
      null,
      {
        baseUrl: "",
      }
    );
    const result = await this.refreshTokenRequest;
    this.refreshTokenRequest = null;
    return result;
  },
  order: (body: GuestCreateOrdersBodyType) => http.post<GuestCreateOrdersResType>("/guest/orders", body),
  getOrderList: () => http.get<GuestGetOrdersResType>("/guest/orders"),
};
export default guestApiRequest;
