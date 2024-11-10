import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

const useProfileUpdate = () => {
    const queryClient = useQueryClient()

    const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useMutation({
        mutationFn: async (formData) => {
            try {
                const res = await fetch('/api/user/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                })
                const data = await res.json()
                if (!res.ok) throw new Error(data.error || "Failed to update profile")
                return data
            } catch (error) {
                console.error("Update Profile Error:", error)
                throw new Error(error.message) 
            }
        },
        onSuccess: () => {
            Promise.all([
                queryClient.invalidateQueries({ queryKey: ['userProfile'] }),
                queryClient.invalidateQueries({ queryKey: ['authUser'] })
            ])
            toast.success("Profile updated successfully")
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })
    return { updateProfile, isUpdatingProfile }
}

export default useProfileUpdate