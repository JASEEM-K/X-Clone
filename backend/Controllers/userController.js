import User from '../models/userModel.js'
import Notification from '../models/notificationModel.js'
import bcryptjs from 'bcryptjs'
import { v2 as cloudinary } from 'cloudinary'

export const getUserProfile = async (req, res) => {
    try {
        const { username } = req.params
        const user = await User.findOne({ username }).select("-password")
        if (!user) {
            return res.status(404).json({
                error: "User Not Found "
            })
        }

        return res.status(200).json(user)
    } catch (error) {
        console.log("Error in Getting User Profile:", error)
        return res.status(500).json({
            error: "Internal Server Error"
        })

    }
}

export const followAndUnfollowUser = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id).select("-password")
        const userToFollow = await User.findById(req.params.id).select("-password")
        if (!currentUser || !userToFollow) {
            return res.status(404).json({
                error: "User Not Found "
            })
        }
        if (currentUser._id === userToFollow._id) {
            return res.status(400).json({
                error: "You Canot Follow YourSelf"
            })
        }

        const isFollowing = userToFollow.followers.includes(currentUser._id)
        if (isFollowing) {
            await User.findByIdAndUpdate(currentUser, { $pull: { following: userToFollow._id } })
            await User.findByIdAndUpdate(userToFollow, { $pull: { followers: currentUser._id } })

            return res.status(200).json({
                message: "UnFollowing User"
            })
        } else {
            await User.findByIdAndUpdate(currentUser, { $push: { following: userToFollow._id } })
            await User.findByIdAndUpdate(userToFollow, { $push: { followers: currentUser._id } })

            const newNotification = new Notification({
                to: userToFollow._id,
                from: currentUser._id,
                type: "follow",
            })

            newNotification.save()

            return res.status(400).json({
                message: "Following User"
            })
        }
    } catch (error) {
        console.log("Error in Following User:", error)
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
}


export const updateProfile = async (req, res) => {
    try {
        const { username, currentPassword, newPassword, email, fullName, bio, link } = req.body
        let { coverImg, profileImg } = req.body
        const user = await User.findById(req.params._id)

        if (!user) {
            return res.status(404).json({
                error: "User Not Found "
            })
        }
        if ((!newPassword && currentPassword) || (newPassword && !currentPassword)) {
            return res.status(400).json({
                error: "Please Provide Both Current and New Password"
            })
        }
        if (newPassword && currentPassword) {
            const isMatch = await bcryptjs.compare(currentPassword, user.password)
            if (!isMatch) {
                return res.status(400).json({
                    error: "Current Password is Incorect"
                })
            }
            if (newPassword.length < 6) {
                return res.status(400).json({
                    error: "Password Should atleast be 6 Character Long "
                })
            }
            const salt = await bcryptjs.genSalt(10)
            user.password = await bcryptjs.hash(newPassword, salt)
        }

        if (username) {
            const usernameRegex = /^[a-zA-Z0-9._-]{3,16}$/
            if(!usernameRegex.test(username)){
                return res.status(400).json({
                    error: "Invalid Username Format"
                })
            }
                const isUsing = (await User.findOne({ username }).select("-password") && username !== user.username)
                if (isUsing) {
                    return res.status(400).json({
                        error: "Username in already in Use"
                    })
                } else {
                    user.username = username
                }
            }
            if (email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if (!emailRegex.test(email)) {
                    return res.status(400).json({
                        error: "Invalid Email Format"
                    })

                }
                const isUsing = (await User.findOne({ email }).select("-password") && email !== user.email)
                if (isUsing) {
                    return res.status(400).json({
                        error: "Email in already in Use"
                    })
                } else {
                    user.email = email
                }
            }
            if (profileImg) {
                if (user.profileImg) {
                    await cloudinary.uploader.destroy(user.profileImg.split('/').pop().split((".")[0]))
                }

                const uploadedResponse = await cloudinary.uploader.upload(profileImg)
                profileImg = uploadedResponse.secure_url
            }
            if (coverImg) {
                if (user.coverImg) {
                    await cloudinary.uploader.destroy(user.coverImg.split('/').pop().split((".")[0]))
                }

                const uploadedResponse = await cloudinary.uploader.upload(coverImg)
                coverImg = uploadedResponse.secure_url
            }

            user.fullName = fullName || user.fullName,
            user.bio = bio || user.bio,
            user.link = link || user.link,
            user.profileImg = profileImg || user.profileImg,
            user.coverImg = coverImg || user.coverImg,

           await user.save()

           user.password = null

           return res.status(200).json(user)

        } catch (error) {
            console.log("Error in Updating Profile :", error)
            return res.status(500).json({
                error: "Internal Server Error"
            })
        }
    }

    export const suggestedUsers = async (req,res) => {
        try {
            //suggesting Users based on users Followers Following
        } catch (error) {
            console.log("Error in Suggested Users :", error)
            return res.status(500).json({
                error: "Internal Server Error"
            })
        }
    }