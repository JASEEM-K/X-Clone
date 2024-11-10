import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PropTypes from 'prop-types';
import toast from "react-hot-toast";
import LoadingSpinner from './LoadingSpinner';
import PostSkeleton from "../Skeleton/PostSkeleton";


const Post = ({ post }) => {
	const [comment, setComment] = useState("");

    const { data:authUser } = useQuery({queryKey: ['authUser']})

	const isLiked = post.likes.includes(authUser._id);

	const formattedDate = "1h";

	const handleDeletePost = (e) => {
		e.preventDefault();
		DeletePost(post._id);
	};

	const handlePostComment = (e) => {
		e.preventDefault();
		commentPost({postId:post._id, comment});
	};

	const handleLikePost = (e) => {
		e.preventDefault();
		likePost(post._id);
	};

	const queryClient = useQueryClient()

    const { mutate: DeletePost , isPending: isDeleting } = useMutation({
        mutationFn: async (postId) => {
            try {
                const res = await fetch(`/api/posts/delete/${postId}`, {
                    method: "DELETE",
                })

                const data = await res.json()
                if(!res.ok) throw new Error(data.error || "Something went wrong")
                return data 
            } catch (error) {
                console.error("Error in Deleting Post:", error)  
                throw error
            }
        },
        onSuccess: () => {
			toast.success("Post Deleted Successfully"),
            queryClient.invalidateQueries({queryKey: ['posts']})
        },
		onError: (error) => {
			toast.error(error.message)
		}
    })

	const postOwner = post.user
	const isMyPost = postOwner._id === authUser._id;

	const { mutate:likePost ,isPending:isLinkingPost } = useMutation({
		mutationFn: async(postId) => {
			try {
				const res = await fetch(`/api/posts/like/${postId}`, {
					method: "POST",	
				})
				const data = await res.json() 
				if(!res.ok) throw new Error(data.error || "Something went wrong")
				return data
			} catch (error) {
				console.error("Error in Liking ", error)
				throw error
			}
		},
		onSuccess: (updatedList) => {
			queryClient.setQueryData(['posts'], (oldData) => {
				return oldData.map((p) => {
					if(p._id === post._id) {
						return {...p, likes: updatedList}
					}
					return p
				})
			})
		},
		onError: (error) => {
			toast.error(error.message)
		}
	})

	const { data: getFullPost, isPending: isGettingPost } = useQuery({
		queryKey: ['fullPost', post._id],
		queryFn: async () => {
			try {
				const res = await fetch(`/api/posts/fullpost/${post._id}`)
				const data = await res.json()
				if (!res.ok) throw new Error(data.error || "Something went wrong")
				return data
			} catch (error) {
				console.error("Error in Getting Full Post:", error)
				throw error
			}
		}
	})

	const { mutate:commentPost ,isPending:isCommenting } = useMutation({
		mutationFn: async({postId, comment}) => {
			try {
				const res = await fetch(`/api/posts/comment/${postId}`, {
					method: "POST",
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ text: comment })
				})
				const data = await res.json()
				if(!res.ok) throw new Error(data.error || "Something went wrong")
				return data
			} catch (error) {
				console.error("Error in Commenting on Post:", error)
				throw error
			}
		},
		onSuccess: () => {
			toast.success("Commented Successfully")
			queryClient.invalidateQueries({queryKey: ['fullPost', post._id]})
		},
		onError: (error) => {
			toast.error(error.message)
		}
	})

	if (isGettingPost) {
		return <PostSkeleton />
	}
	return (
		<>
			<div className='flex gap-2 items-start p-4 border-b border-gray-700'>
				<div className='avatar'>
					<Link to={`/profile/${postOwner.username}`} className='w-8 rounded-full overflow-hidden'>
						<img src={postOwner.profileImg || "/src/assets/placeholder.bmp"} />
					</Link>
				</div>
				<div className='flex flex-col flex-1'>
					<div className='flex gap-2 items-center'>
						<Link to={`/profile/${postOwner.username}`} className='font-bold'>
							{postOwner.fullName}
						</Link>
						<span className='text-gray-700 flex gap-1 text-sm'>
							<Link to={`/profile/${postOwner.username}`}>@{postOwner.username}</Link>
							<span>·</span>
							<span>{formattedDate}</span>
						</span>
						{isMyPost && (
							<span className='flex justify-end flex-1'>
								{isDeleting ? <LoadingSpinner /> :
								<FaTrash className='cursor-pointer hover:text-red-500' onClick={(e) => handleDeletePost(e)} /> }
							</span>
						)}
					</div>
					<div className='flex flex-col gap-3 overflow-hidden'>
						<span>{post.text}</span>
						{post.img && (
							<img
								src={post.img}
								className='h-80 object-contain rounded-lg border border-gray-700'
								alt=''
							/>
						)}
					</div>
					<div className='flex justify-between mt-3'>
						<div className='flex gap-4 items-center w-2/3 justify-between'>
							<div
								className='flex gap-1 items-center cursor-pointer group'
								onClick={() => document.getElementById("comments_modal" + post._id).showModal()}
							>
								<FaRegComment className='w-4 h-4  text-slate-500 group-hover:text-sky-400' />
								<span className='text-sm text-slate-500 group-hover:text-sky-400'>
									{post.comments.length}
								</span>
							</div>
							{/* We're using Modal Component from DaisyUI */}
							<dialog id={`comments_modal${post._id}`} className='modal border-none outline-none'>
								<div className='modal-box rounded border border-gray-600'>
									<h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
									<div className='flex flex-col gap-3 max-h-60 overflow-auto'>
										{post.comments.length === 0 && (
											<p className='text-sm text-slate-500'>
												No comments yet 🤔 Be the first one 😉
											</p>
										)}
										{getFullPost.comments.map((comment) => (
											<div key={comment._id} className='flex gap-2 items-start'>
												<div className='avatar'>
													<div className='w-8 rounded-full'>
														<img
															src={comment.user.profileImg || "/src/assets/placeholder.bmp"}
														/>
													</div>
												</div>
												<div className='flex flex-col'>
													<div className='flex items-center gap-1'>
														<span className='font-bold'>{comment.user.fullName}</span>
														<span className='text-gray-700 text-sm'>
															@{comment.user.username}
														</span>
													</div>
													<div className='text-sm'>{comment.text}</div>
												</div>
											</div>
										))}
									</div>
									<form
										className='flex gap-2 items-center mt-4 border-t border-gray-600 pt-2'
										onSubmit={handlePostComment}
									>
										<textarea
											className='textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800'
											placeholder='Add a comment...'
											value={comment}
											onChange={(e) => setComment(e.target.value)}
										/>
										<button className='btn btn-primary rounded-full btn-sm text-white px-4'>
											{isCommenting ? (
												<span className='loading loading-spinner loading-md'></span>
											) : (
												"Post"
											)}
										</button>
									</form>
								</div>
								<form method='dialog' className='modal-backdrop'>
									<button className='outline-none'>close</button>
								</form>
							</dialog>
							<div className='flex gap-1 items-center group cursor-pointer'>
								<BiRepost className='w-6 h-6  text-slate-500 group-hover:text-green-500' />
								<span className='text-sm text-slate-500 group-hover:text-green-500'>0</span>
							</div>
							<div className='flex gap-1 items-center group cursor-pointer' onClick={(e) => handleLikePost(e)}>
								{!isLiked && !isLinkingPost && (
									<FaRegHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500' />
								)}
								{isLiked && !isLinkingPost && <FaRegHeart className='w-4 h-4 cursor-pointer text-pink-500 ' />}
								{isLinkingPost && (
									<LoadingSpinner />
								)}
								<span
									className={`text-sm text-slate-500 group-hover:text-pink-500 ${
										isLiked ? "text-pink-500" : ""
									}`}
								>
									{post.likes.length}
								</span>
							</div>
						</div>
						<div className='flex w-1/3 justify-end gap-2 items-center'>
							<FaRegBookmark className='w-4 h-4 text-slate-500 cursor-pointer' />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default Post;

Post.propTypes = {
    post: PropTypes.object,
};