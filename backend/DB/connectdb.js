import mongoose from "mongoose";

mongoose.connection.on('connected', () => console.log('connected'));
mongoose.connection.on('disconnected', () => console.log('disconnected'));
mongoose.connection.on('reconnected', () => console.log('reconnected'));
mongoose.connection.on('disconnecting', () => console.log('disconnecting'));
mongoose.connection.on('close', () => console.log('close'));


export async function connectDB(DB_URL) {
    if (!DB_URL) {
        throw new Error("DB_URL is missing from backend environment configuration");
    }
    try {
        console.log("Connecting to MongoDB...");
        const connect = await mongoose.connect(DB_URL, { serverSelectionTimeoutMS: 10000 });
        console.log(`Database connected Successfully AND HOST is ${connect.connection.host}`)
    } catch (error) {
        console.error("Error While Connecting Database:", error.message);
        throw error;
    }
}
