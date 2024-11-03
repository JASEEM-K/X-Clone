import User from '../models/userModel'

export const getUserProfile = async (req,res) => {
    try {
        const {username} = req.params
        const user = await User.findOne({username}).select("-password")
    } catch (error) {
        
    }
}