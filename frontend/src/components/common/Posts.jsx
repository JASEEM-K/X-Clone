import Post from "./Post";
import PostSkeleton from "../Skeleton/PostSkeleton";
import { useQuery } from "@tanstack/react-query";

const Posts = () => {
  const { data:Posts , isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/posts/all')
        const data = await res.json()
        if(!res.ok) throw new Error(data.error || "Something Went Wrong")
		console.log(data)
		return data
      } catch (error) {
        console.log("Error in Getting Post",error)
      }
    }
   })
	return (
		<>
			{isLoading && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && Posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && Posts && (
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