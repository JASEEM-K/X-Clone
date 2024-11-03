import bcryptjs from 'bcryptjs'
import User from '../models/userModel.js'
import { generateTokenAndSetCookie } from '../lib/util/generateToken.js'

export const signupUser = async (req, res) => {
    try {
        const { username, password, fullName, email } = req.body
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: "Invalid email format"
            })
        }
        const usernameRegex = /^[a-zA-Z0-9._-]{3,16}$/
        if (!usernameRegex.test(username)) {
            return res.status(400).json({
                error: "Invalid Username Format"
            })
        }
        const existingUserName = await User.findOne({ username })
        if (existingUserName) {
            return res.status(400).json({
                error: "Username Already using By Someone"
            })
        }
        const existingEmail = await User.findOne({ email })
        if (existingEmail) {
            return res.status(400).json({
                error: "Emai Already using By Someone"
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: "Password must be Longer than 6 letters"
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPass = await bcryptjs.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password: hashPass,
            fullName,
        })

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save()

            return res.status(201).json({
                message: "Accound Created"
            })
        } else {
            return res.status(400).json({
                error: "Invalid user data"
            })

        }

    } catch (error) {
        console.log("Error is SignUp Controller:", error)
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })
        const isCorrectPassword = await bcryptjs.compare(password, user?.password || "")
        if (!user || !isCorrectPassword) {
            return res.status(400).json({
                error: "Invalid username or Password"
            })
        }

        generateTokenAndSetCookie(user._id, res)

        return res.status(200).json({
            message: "LoginingIN successfull"
        })

    } catch (error) {
        console.log("Error is Login Controller:", error)
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        return res.status(200).json({
            message: "Logout Successfully"
        })
    } catch (error) {
        console.log("Error is LogingOut Controller:", error)
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
}

export const authCheck = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password")
        res.status(200).json(user)
    } catch (error) {
        console.log("Error is Auth Checking Controller:", error)
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
}