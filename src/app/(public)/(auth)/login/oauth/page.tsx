"use client";
import { useAppStore } from "@/components/app-provider";
import { toast } from "@/components/ui/use-toast";
import { decodeToken, generateSocketInstance } from "@/lib/utils";
import { useSetTokenToCookieMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Suspense } from 'react'

const OAuthPage = () => {
  const { mutateAsync } = useSetTokenToCookieMutation();
  const setRole = useAppStore(state => state.setRole);
  const setSocket = useAppStore(state => state.setSocket);
  const searchParams = useSearchParams();
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const message = searchParams.get("message");
  const router = useRouter();
  useEffect(() => {
    if (accessToken && refreshToken) {
      const { role } = decodeToken(accessToken);
      mutateAsync({ accessToken, refreshToken })
        .then(() => {
          setRole(role);
          setSocket(generateSocketInstance(accessToken));
          router.push("/manage/dashboard");
        })
        .catch((e) => {
          toast({
            description: e.message || "Có lỗi xảy ra",
          });
        });
    } else {
      setTimeout(() => {
        toast({
          description: message || "Có lỗi xảy ra",
        });
      });
      router.push("/login");
    }
  }, [
    accessToken,
    message,
    mutateAsync,
    refreshToken,
    router,
    setRole,
    setSocket,
  ]);
  return null;
};
const OAuthPageWithSuspense = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <OAuthPage />
  </Suspense>
);

export default OAuthPageWithSuspense;

