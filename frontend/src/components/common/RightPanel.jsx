import { Link } from "react-router-dom";
import RightPanelSkeleton from "../Skeleton/RightPanelSkeleton";
import { useQuery } from "@tanstack/react-query";
import useFollow from "../../hooks/useFollow";
import { useState } from "react";

const RightPanel = () => {
    const { data:authUser } = useQuery({queryKey: ["authUser"]})
    const isAlreadyFollowing = (userId) =>{
        return authUser.following.includes(userId)? true : false
    }
    const [ loadinUser, setLoadingUser ] = useState()
    const { data:suggestedUsers , isLoading } = useQuery({
        queryKey: ['suggestedUsers'], 
        queryFn: async () => {
            try {
                const res = await fetch('/api/user/suggested')
                const data = await res.json()
                if(!res.ok) throw new Error(data.error || "Something went Wrong")
                return data
            } catch (error) {
                throw new Error(error.message),
                console.error("Error in Suggested Users Querry:",error)
            }
        },
    })

    const { followUser, isPending } = useFollow()

    if(suggestedUsers?.length === 0) return(<div className="md:w-64 w-0"></div>)

    return (
        <div className='hidden lg:block my-4 mx-2'>
            <div className='bg-[#16181C] p-4 rounded-md sticky top-2'>
                <p className='font-bold'>Who to follow</p>
                <div className='flex flex-col gap-4 w-64'>
                    {/* item */}
                    {isLoading && (
                        <>
                            <RightPanelSkeleton />
                            <RightPanelSkeleton />
                            <RightPanelSkeleton />
                            <RightPanelSkeleton />
                        </>
                    )}
                    {!isLoading &&
                        suggestedUsers.data?.map((user) => (
                            <Link
                                to={`/profile/${user.username}`}
                                className='flex items-center justify-between gap-4'
                                key={user._id}
                            >
                                <div className='flex gap-2 items-center'>
                                    <div className='avatar'>
                                        <div className='w-8 rounded-full'>
                                            <img src={user.profileImg || "/src/assets/placeholder.bmp"} />
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='font-semibold tracking-tight truncate w-28'>
                                            {user.fullName}
                                        </span>
                                        <span className='text-sm text-slate-500'>@{user.username}</span>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        className={loadinUser === user._id && isAlreadyFollowing(user._id)?
                                            'btn border-white bg-black text-white hover:bg-red-950 hover:text-red-500 hover:border-red-500 hover:opacity-90 rounded-full btn-sm':
                                            'btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            followUser(user._id)
                                            setLoadingUser(user._id)
                                        }}
                                    >
                                        {loadinUser === user._id && isPending ? "Loading..." :
                                        isAlreadyFollowing(user._id)?
                                            "Unfollow":
                                            "Follow" 
                                        }
									</button>
								</div>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
};
export default RightPanel;