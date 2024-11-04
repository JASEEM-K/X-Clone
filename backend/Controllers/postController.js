import {v2 as cloudinary} from 'cloudinary'
import Post from '../models/postModel.js'
import User from '../models/userModel'


export const createPost = async (req, res) => {
    try {
        const { text } = req.body
        let { img } = req.body
         
        if(!img && !text){
            return res.status(400).json({ error: "Please Provide Text or Image" })
        }
        if(img){
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
        if(!post){
            return res.status(404).json({ error: "Post Not Found" })
        }
        if(post.likes.includes(req.user._id)){
            await post.findByIdAndUpdate(id,{ $pull: { likes: req.user._id } })
            await User.findByIdAndUpdate(req.user._id, { $pull: { liked: id } })

            const updatedList = post.like.filter((id) => id.toString() !== req.user._id.toString())
            return res.status(200).json(updatedList)
        } else if(!post.likes.includes(req.user._id)){
            await post.findByIdAndUpdate(id, { $push: { likes: req.user._id } })
            await User.findByIdAndUpdate(req.user._id, { $push: { liked: id } })

            const updatedList = post.like.filter((id) => id.toString() !== req.user._id.toString())
            return res.status(200).json(updatedList)

        }

    } catch (error) {
        console.log("Error in Like Post:", error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const savePost = async (req, res) => {
    try {
        const { id:postId } = req.params
        const post = await Post.findById(postId)
        const user = await User.findById(req.user._id)
        if(!post){
            return res.status(404).json({ error: "Post Not Found" })    
        }
        if(user.saved.includes(postId)){
            await User.findByIdAndUpdate(req.user._id, { $pull: { saved: postId } })
            
            const  updatedList = user.saved.filter((id) => id.toString() !== postId.toString())
            return res.status(200).json(updatedList)
        } else if(!user.saved.includes(postId)){
            await User.findByIdAndUpdate(req.user._id, { $push: { saved: postId}})

            const updatedList = user.saved.filter((id) => id.toString() !== postId.toString())
            return res.status(200).json(updatedList)
        }
    } catch (error) {
       console.log("Error in Saving Post:", error)
       return res.status(500).json({ error: "Internal Server Error" }) 
    }
}