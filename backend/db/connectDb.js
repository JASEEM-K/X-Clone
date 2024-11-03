import mongoose from 'mongoose'

export const connectDb = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to Mongo DB:",con.connection.host)
    } catch (error) {
        console.log("Error in Connecting DB",error)
        process.exit(1)
    }

}