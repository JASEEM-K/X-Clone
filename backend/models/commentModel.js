import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    replies: [
        {
            text: {
                type: String,
                required: true,
            },
            likes: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "user",
                }
            ],
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
                required: true,
            },
            time: {
                type: Date,
                default: Date.now(),
            },
        }
    ],

}, { timestamps: true })

const Comment = mongoose.model("Comment", commentSchema)

export default Comment