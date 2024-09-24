import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Role } from "./constants/type";
import jwt from "jsonwebtoken";
import { TokenPayload } from "./types/jwt.types";

 const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload;
};
const managePaths = ["/manage"];
const guestPaths = ["/guest"];
const onlyOwnerPaths = ["/manage/accounts"];
const privatePaths = [...managePaths, ...guestPaths];
const loggedInPaths = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  // Chưa đăng nhập thì không cho vào privatePaths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("clear-tokens", "true");
    return NextResponse.redirect(url);
  }

  if (refreshToken) {
    // Đã đăng nhập thì không cho vào login
    if (
      loggedInPaths.some((path) => pathname.startsWith(path)) &&
      refreshToken
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const role = decodeToken(refreshToken).role;
    const isGuestRequestAuthAdmin =
      role === Role.Guest &&
      managePaths.some((path) => pathname.startsWith(path));
    const isNotGuestRequestAuthGuest =
      role !== Role.Guest &&
      guestPaths.some((path) => pathname.startsWith(path));
      const isNotOwnerGoToOwnerPath = role !== Role.Owner && onlyOwnerPaths.some((path) => pathname.startsWith(path));
    if (isGuestRequestAuthAdmin || isNotGuestRequestAuthGuest || isNotOwnerGoToOwnerPath) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/manage/:path*", "/guest/:path*", "/login"],
};
