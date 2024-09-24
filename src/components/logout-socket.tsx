import { useLogoutMutation } from "@/queries/useAuth";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppContext } from "./app-provider";
import { handleErrorApi } from "@/lib/utils";

const UNAUTHENTICATED_PATH = ["/login", "/logout", "/refresh-token"];
export default function LogoutSocket() {
  const pathname = usePathname();
  const router = useRouter();
  const { isPending, mutateAsync } = useLogoutMutation();
  const { setRole, socket, setSocket } = useAppContext();

  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;
    async function onLogout() {
      if (isPending) return;
      try {
        await mutateAsync();
        setRole();
        socket?.disconnect()
        setSocket(undefined)
        router.push("/");
      } catch (error) {
        handleErrorApi({
          error,
        });
      }
    }
    socket?.on("logout", onLogout);
    return () => {
      socket?.off("logout", onLogout);
    };
  }, [router, pathname, isPending, mutateAsync, setRole, socket, setSocket]);
  return null;
}
