import express from 'express'
import { protectedRoute } from '../Middleware/protectedRoute.js'
import { commentOnPost, createPost, deletePost, getAllPosts, getFollowersPosts, getFullPost, getLikedPosts, getSavedPosts, getUserPost, likePost , replyToComment, savePost } from '../Controllers/postController.js'

const route = express.Router()

route.post("/create",protectedRoute,createPost)

route.post("/like/:id",protectedRoute,likePost)

route.post("/save/:id",protectedRoute,savePost)

route.post("/comment/:id",protectedRoute,commentOnPost)

route.post("/comment/reply/:id",protectedRoute,replyToComment)

route.delete("/delete/:id",protectedRoute,deletePost)

route.get("/all",protectedRoute,getAllPosts)

route.get("/fullpost/:id",protectedRoute,getFullPost)

route.get("/liked/:id",protectedRoute,getLikedPosts)

route.get("/saved",protectedRoute,getSavedPosts)

route.get("/followers",protectedRoute,getFollowersPosts)

route.get("/user/:id",protectedRoute,getUserPost)

export default route