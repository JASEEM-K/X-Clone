import express from 'express'
import { deleteNotification, getNotifications } from '../Controllers/notificationController.js'
import { protectedRoute } from '../Middleware/protectedRoute.js'

const route = express.Router()

route.route('/').get(protectedRoute,getNotifications).delete(protectedRoute,deleteNotification)

export default route