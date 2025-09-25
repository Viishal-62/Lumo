import mongoose from "mongoose";
import { ENV } from "./envConfig.js";

export const connectDB = async () =>{
    try {
         await mongoose.connect(ENV.MONGO_URI)
    } catch (error) {
        console.log("Error while connecting to MongoDB" , error)
        process.exit(1);
    }
}


