import authApiRequest from "@/apiRequests/auth"
import { useMutation } from "@tanstack/react-query"

export const useLoginMumation = () => {
    return useMutation({
        mutationFn: authApiRequest.clientLogin
    })
}