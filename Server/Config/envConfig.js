import { configDotenv } from "dotenv";

configDotenv();


let requiredKeys = ["PORT" ,"GROQ_API_KEY" , "TAVILY_API_KEY" , "GOOGLE_CLIENT_ID" , "GOOGLE_CLIENT_SECRET" , "REDIRECT_URL"];


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
    REDIRECT_URL : process.env.REDIRECT_URL
}
