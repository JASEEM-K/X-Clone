import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import {v2 as cloudinary} from 'cloudinary'

import authRoute from './Routes/authRoute.js'

import {connectDb} from './db/connectDb.js'

const app = express()
dotenv.config()
cloudinary.config({
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_NAME,
})

const PORT = process.env.PORT || 5000

app.use(express.json({limit: "5mb"}))
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use("/api/auth",authRoute)

app.listen(PORT,() => {
    connectDb()
    console.log("Server is Runnig on http://localhost:"+PORT)
})