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
            required: true,
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
                    required: true,
                }
            ],
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
                required: true,
            },
        }
    ],

}, { timestamps: true })

const Comment = mongoose.model("Comment", commentSchema)

export default Comment