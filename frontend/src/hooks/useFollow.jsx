import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

const useFollow = () => {

    const queryClient = useQueryClient()
    const { mutate: followUser, isPending } = useMutation({
        mutationFn: async (userId) => {
            try {
                const res = await fetch(`/api/user/follow/${userId}`, {
                    method: "POST",
                })
                const data = await res.json()
                if (!res.ok) throw new Error(data.error || "Something went Wrong")
                return data
            } catch (error) {
                console.error("Error in Follow User:", error)
            }
        },
        onSuccess: () => {
            Promise.all([
                queryClient.invalidateQueries({ queryKey: ['authUser'] }),
            ])
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

  return {followUser, isPending}
  
}

export default useFollow