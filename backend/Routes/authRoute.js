import express from 'express'
import {authCheck, login, logout, signupUser} from '../Controllers/authController.js'
import {protectedRoute} from '../Middleware/protectedRoute.js'

const route = express.Router()

route.post('/signup',signupUser)

route.post('/login',login)

route.get('/logout',logout)

route.get('/me',protectedRoute,authCheck)

export default route