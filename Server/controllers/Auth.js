
import { google } from "googleapis"
import { ENV } from "../Config/envConfig.js";




export const oauth2Client = new google.auth.OAuth2(
 ENV.GCID,ENV.GSECRET , ENV.REDIRECT_URL
);

console.log(ENV.REDIRECT_URL)


export const auth = async(req,res) =>{
    try {
        
      const scopes = ['https://www.googleapis.com/auth/calendar']; // it's for what kind of access we want from user via consent screen 

const url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',
  prompt : "consent",

  // If you only need one scope, you can pass it as a string
  scope: scopes // so we pass that scopes here in scope
});

        res.redirect(url)
    } catch (error) {
        console.log("something went wrong" , error)
    }
}


export const callBack = async(req,res) =>{
    try {
         let {code} = req.query;
           
         console.log(code)
         const {tokens} = await oauth2Client.getToken(code);

         console.log(tokens || "Nothing found!")

         res.status(200).send("✅ Authenticated Successfully")
    } catch (error) {
        console.log("something went wrong in callback" , error)
    }
}