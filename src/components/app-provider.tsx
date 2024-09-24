"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import RefreshToken from "./refresh-token";
import {
  useContext,
  createContext,
  useState,
  useEffect,
  useCallback,
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const AppContext = createContext({
  role: undefined as RoleType | undefined,
  setRole: (role?: RoleType | undefined) => {},
  socket: undefined as Socket | undefined,
  setSocket: (socket?: Socket | undefined) => {},
});
export const useAppContext = () => {
  return useContext(AppContext);
};

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [socket, setSocket] = useState<Socket | undefined>();
  const [role, setRoleState] = useState<RoleType | undefined>();
  const count = useRef(0);
  useEffect(() => {
    if (count.current === 0) {
      const accessToken = getAccessTokenFromLocalStorage();
      if (accessToken) {
        const role = decodeToken(accessToken).role;
        setRoleState(role);
        setSocket(generateSocketInstance(accessToken));
      }
      count.current++;
    }
  }, []);
  const setRole = useCallback((role?: RoleType | undefined) => {
    setRoleState(role);
    if (!role) {
      removeTokenFromLocalStorage();
    }
  }, []);

  return (
    <AppContext.Provider value={{ role, setRole, socket, setSocket }}>
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <LogoutSocket />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext.Provider>
  );
}
