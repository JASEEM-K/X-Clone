import { v2 as cloudinary } from 'cloudinary'
import Post from '../models/postModel.js'
import User from '../models/userModel.js'
import Comment from '../models/commentModel.js'
import Notification from '../models/notificationModel.js'


export const createPost = async (req, res) => {
    try {
        const { text } = req.body
        let { img } = req.body

        if (!img && !text) {
            return res.status(400).json({ error: "Please Provide Text or Image" })
        }
        if (img) {
            const uploadResponse = await cloudinary.uploader.upload(img)
            img = uploadResponse.secure_url
        }
        const newPost = new Post({
            text,
            img,
            user: req.user._id
        })

        await newPost.save()
        return res.status(200).json(newPost)
    } catch (error) {
        console.log("Error in Creating Post:", error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const likePost = async (req, res) => {
    try {
        const { id } = req.params
        const post = await Post.findById(id)
        if (!post) {
            return res.status(404).json({ error: "Post Not Found" })
        }
        if (post.likes.includes(req.user._id)) {
            await Post.findByIdAndUpdate(id, { $pull: { likes: req.user._id } })
            await User.findByIdAndUpdate(req.user._id, { $pull: { liked: id } })

            const updatedList = post.likes.filter((id) => id.toString() !== req.user._id.toString())
            return res.status(200).json(updatedList)
        } else if (!post.likes.includes(req.user._id)) {
            post.likes.push(req.user._id)
            await User.findByIdAndUpdate(req.user._id, { $push: { liked: id } })
            await post.save()

            const newNoti = new Notification({
                from: req.user._id,
                to: post.user,
                type: "like",
            })

            await newNoti.save()

            const updatedList = post.likes
            return res.status(200).json(updatedList)

        }

    } catch (error) {
        console.log("Error in Like Post:", error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const savePost = async (req, res) => {
    try {
        const { id: postId } = req.params
        const post = await Post.findById(postId)
        const user = await User.findById(req.user._id)
        if (!post) {
            return res.status(404).json({ error: "Post Not Found" })
        }
        if (user.saved.includes(postId)) {
            await User.findByIdAndUpdate(req.user._id, { $pull: { saved: postId } })

            const updatedList = user.saved.filter((id) => id.toString() !== postId.toString())
            return res.status(200).json(updatedList)
        } else if (!user.saved.includes(postId)) {
            user.saved.push(postId)
            user.save()

            const updatedList = user.saved
            return res.status(200).json(updatedList)
        }
    } catch (error) {
        console.log("Error in Saving Post:", error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body
        const { id: postId } = req.params
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({ error: "Post Not Found" })
        }
        if (!text) {
            return res.status(400).json({ error: "Please Provide Text" })
        }
        const newComment = new Comment({
            text,
            user: req.user._id,
        })
        await Post.findByIdAndUpdate(postId, { $push: { comments: newComment._id } })
        await newComment.save()

        return res.status(200).json(newComment)
    } catch (error) {
        console.log("Error in Commenting On Post:", error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const replyToComment = async (req, res) => {
    try {
        const { id: commentId } = req.params
        const { text } = req.body
        const comment = await Comment.findById(commentId)
        if (!comment) {
            return res.status(404).json({ error: "Comment Not Found" })
        }
        if (!text) {
            return res.status(400).json({ error: "Please Provide Text" })
        }
        const newReply = new Comment({
            text,
            user: req.user._id,
            replyTo: comment.user,
        })

        await Comment.findByIdAndUpdate(commentId, { $push: { replies: newReply._id } })
        await newReply.save()

        return res.status(200).json({ message: "Reply sent Successfully" })
    } catch (error) {
        console.log("Error in Replying To Comment :", error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const deletePost = async (req, res) => {
    try {
        const { id: postId } = req.params
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({ error: "Post Not Found" })
        }
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "Unauthorized Access" })
        }
        await Post.findByIdAndDelete(postId)

        return res.status(200).json({ message: "Post Deleted" })
    } catch (error) {
        console.log("Error in Deleting Post:", error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}


export const getAllPosts = async (_, res) => {
    try {
        const posts = await Post.find()
            .populate('user', '-password')
            .sort({createdAt: -1})
        return res.status(200).json(posts)
    } catch (error) {
        console.log("Error in Getting All Posts:", error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}


export const getFullPost = async (req, res) => {
    try {
        const { id: postId } = req.params
        if (!postId) {
            return res.status(404).json({ error: "Post Not Found" })
        }
        const post = await Post.findById(postId)
            .sort({ createdAt: -1 })
            .populate('user', '-password')
            .populate({
                path: 'comments',
                populate: [
                    {
                        path: 'replies',
                        populate: [{
                            path: 'user',
                            select: '-password'
                        }, {
                            path: 'replyTo',
                            select: 'username'
                        }]
                    },
                    {
                        path: 'user',
                        select: '-password'
                    },
                ]
            })
        return res.status(200).json(post)
    } catch (error) {
        console.log("Error in Getting Post Commnets :", error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}


export const getLikedPosts = async (req, res) => {
    try {
        const { id: userId } = req.params
        if(!userId) {
            return res.status(404).json({ error: "User Not Found" })
        }
        const posts = await User.findById(userId)
            .populate({
                path: 'liked',
                populate: {
                    path: 'user',
                    select: '-password'
                }
            })

        return res.status(200).json(posts.liked)

    } catch (error) {
        console.log("Error in Getting Liked Posts:", error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getSavedPosts = async (req, res) => {
    try {
        const posts = await User.findById(req.user._id)
            .populate({
                path: 'saved',
                populate: {
                    path: 'user',
                    select: '-password'
                }
            })
        return res.status(200).json(posts.saved)
    } catch (error) {
        console.log("Error in Getting Saved Posts:", error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getFollowersPosts = async (req, res) => {
    try {
        const following = await User.findById(req.user._id).select('following')
        const posts = await Post.find({ user: { $in: following.following } })
            .sort({ createdAt: -1 })
            .populate('user', '-password')
        return res.status(200).json(posts)
    } catch (error) {
        console.log("Error in Getting Followers Posts:", error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getUserPost = async (req, res) => {
    try {
        const { id: userId } = req.params
        if(!userId){
            return res.status(404).json({ error: "User Not Found" })
        }
        const posts = await Post.find({user: userId})
            .sort({ createdAt: -1 })
            .populate('user', '-password')
        return res.status(200).json(posts)
    } catch (error) {
       console.log("Error in Getting User Post:", error)
       return res.status(500).json({ error: "Internal Server Error" }) 
    }
}
