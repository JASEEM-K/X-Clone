import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    text: {
        type: String,
    },
    img: {
        type: String,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: [],
    }]

}, { timestamps: true })

const Post = mongoose.model("Post", postSchema)

export default  Post