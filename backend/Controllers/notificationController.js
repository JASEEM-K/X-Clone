import Notification from "../models/notificationModel.js"


export const getNotifications = async (req, res) => {
    try {
        const noti = await Notification.find({ to: req.user._id }).populate({
                path: "from",
                select: "username profileImg fullName"
            })
        await Notification.updateMany({ to: req.user._id }, { read: true })
        return res.status(200).json(noti)
    } catch (error) {
        console.log("Error in Getting Notifications:", error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const deleteNotification = async (req, res) => {
    try {
        await Notification.deleteMany({to: req.user._id})
        return res.status(200).json({ message: "Notifications Deleted Successfully" })
    } catch (error) {
        console.log("Error in Deleting Notifications:", error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}