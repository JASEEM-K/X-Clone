import express from 'express'
import { protectedRoute } from '../Middleware/protectedRoute.js'
import { createPost, likePost , savePost } from '../Controllers/postController.js'

const route = express.Router()

route.post("/create",protectedRoute,createPost)

route.post("/like/:id",protectedRoute,likePost)

route.post("/save/:id",protectedRoute,savePost)

route.post("/comment/:id",)

route.post("/comment/reply/:id",)

route.delete("/delete/:id",)

route.get("/all",)

route.get("/liked",)

route.get("/saved",)

route.get("/followers",)

route.get("/user/:id",)

export default route