import accountApiRequest from "@/apiRequests/account"
import { useQuery } from "@tanstack/react-query"

export const useAccount = () => {
    return useQuery({
        queryKey: ["account"],
        queryFn: accountApiRequest.me
    })
}