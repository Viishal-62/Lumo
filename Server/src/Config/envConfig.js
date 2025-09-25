import { configDotenv } from "dotenv";

configDotenv();


let requiredKeys = ["PORT" ,"GROQ_API_KEY" , "TAVILY_API_KEY" , "GOOGLE_CLIENT_ID" , "GOOGLE_CLIENT_SECRET" , "REDIRECT_URL" , "GEMINI_API_KEY" , "CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET" , "JWT_SECRET_KEY" , "MONGO_URI"];


requiredKeys.forEach((key) =>{
    if(!process.env[key]){
        throw new Error(`Missing environment variable: ${key}`)
    }
})



export const ENV = {
    PORT : process.env.PORT,
    GROQ : process.env.GROQ_API_KEY,
    TAVILY : process.env.TAVILY_API_KEY,
    GCID:process.env.GOOGLE_CLIENT_ID,
    GSECRET:process.env.GOOGLE_CLIENT_SECRET,
    REDIRECT_URL : process.env.REDIRECT_URL,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    JWT_SECRET_KEY : process.env.JWT_SECRET_KEY,
    MONGO_URI : process.env.MONGO_URI
}
