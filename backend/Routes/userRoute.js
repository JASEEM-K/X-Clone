import express from 'express'
import { protectedRoute } from '../Middleware/protectedRoute.js'
import { getUserProfile,followAndUnfollowUser, updateProfile, suggestedUsers } from '../Controllers/userController.js'

const route = express.Router()

route.get("/profile/:username",protectedRoute,getUserProfile)

route.post("/follow/:id",protectedRoute,followAndUnfollowUser)

route.post("/update",protectedRoute,updateProfile)

route.get("/suggested",protectedRoute,suggestedUsers)

export default route