"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import RefreshToken from "./refresh-token";
import {
  useEffect,
  useRef,
} from "react";
import { RoleType } from "@/types/jwt.types";
import {
  decodeToken,
  generateSocketInstance,
  getAccessTokenFromLocalStorage,
  removeTokenFromLocalStorage,
} from "@/lib/utils";
import LogoutSocket from "./logout-socket";
import type { Socket } from "socket.io-client";
import { create } from "zustand";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

type AppStoreType = {
  role: RoleType | undefined;
  setRole: (role?: RoleType | undefined) => void;
  socket: Socket | undefined;
  setSocket: (socket?: Socket | undefined) => void;
};

export const useAppStore = create<AppStoreType>((set) => ({
  role: undefined as RoleType | undefined,
  setRole: (role?: RoleType | undefined) => {
    set({ role });
    if (!role) removeTokenFromLocalStorage();
  },
  socket: undefined as Socket | undefined,
  setSocket: (socket?: Socket | undefined) => set({ socket }),
}));

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setRole = useAppStore(state => state.setRole);
  const setSocket = useAppStore(state => state.setSocket);
  const count = useRef(0);
  useEffect(() => {
    if (count.current === 0) {
      const accessToken = getAccessTokenFromLocalStorage();
      if (accessToken) {
        const role = decodeToken(accessToken).role;
        setRole(role);
        setSocket(generateSocketInstance(accessToken));
      }
      count.current++;
    }
  }, [setRole, setSocket]);

  return (
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <LogoutSocket />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
  );
}
