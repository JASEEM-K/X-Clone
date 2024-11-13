import Post from "./Post";
import PostSkeleton from "../Skeleton/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import PropTypes from 'prop-types'
import { useEffect } from "react";

const Posts = ({ feedType, userId }) => {
	const getPostEndpoint = () => {
		switch (feedType) {
			case "forYou":
				return '/api/posts/all'
			case "following":
				return `/api/posts/followers`
			case "posts":
				return `/api/posts/user/${userId}`
			case "liked":
				return `/api/posts/liked/${userId}`
			case "saved":
				return `/api/posts/saved/${userId}`
			default:
				return '/api/posts/all'
		}
	}

	const PostEndPoint = getPostEndpoint()
	const { data: Posts, isLoading, refetch, isRefetching } = useQuery({
		queryKey: ['posts'],
		queryFn: async () => {
			try {
				const res = await fetch(PostEndPoint)
				const data = await res.json()
				if (!res.ok) throw new Error(data.error || "Something Went Wrong")
				return data
			} catch (error) {
				console.log("Error in Getting Post", error)
			}
		}
	})

	useEffect(() => {
		refetch()
	},[feedType, userId, refetch])
	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && Posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && Posts && (
				<div>
					{Posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;

Posts.propTypes = {
	feedType: PropTypes.string,
	userId: PropTypes.string,
};