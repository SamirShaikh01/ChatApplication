import mongoose from "mongoose";
// Function to connect with mongodb database

export const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log("Database Is connected");
        })
        await mongoose.connect(`${process.env.MONGODB_URI}/chatApp`)
    } catch (error) {
        console.log("Database : Connection : db.js : " + error);
    }
}