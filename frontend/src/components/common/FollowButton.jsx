import { useQuery } from "@tanstack/react-query"
import useFollow from "../../hooks/useFollow"
import PropTypes from 'prop-types'
import { useState } from "react"

const FollowButton = ({ userId }) => {
    const { data: authUser } = useQuery({ queryKey: ["authUser"] })
    const { followUser, isPending } = useFollow()
    const [loadinUser, setLoadingUser] = useState()

    const isAlreadyFollowing = (userId) => {
        return authUser.following.includes(userId) ? true : false
    }
    return (
        <button
            className={loadinUser === userId && isAlreadyFollowing(userId) ?
                'btn border-white bg-black text-white hover:bg-red-950 hover:text-red-500 hover:border-red-500 hover:opacity-90 rounded-full btn-sm' :
                'btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'}
            onClick={(e) => {
                e.preventDefault()
                followUser(userId)
                setLoadingUser(userId)
            }}
        >
            {loadinUser === userId && isPending ? "Loading..." :
                isAlreadyFollowing(userId) ?
                    "Unfollow" :
                    "Follow"
            }
        </button>
    )
}

export default FollowButton

FollowButton.propTypes = {
    userId: PropTypes.string,
}