import { google } from "googleapis";
import { ENV } from "../Config/envConfig.js";
import { User } from "../Model/usermodel.js";
import { createJWT_Token } from "../utils/Helper.js";

// ============================
// 🔑 Google OAuth2 Client Setup
// ============================
export const oauth2Client = new google.auth.OAuth2(
  ENV.GCID,
  ENV.GSECRET,
  ENV.REDIRECT_URL
);
 

// ============================
// 🔹 Step 1: Redirect to Google Consent Screen
// ============================
export const auth = async (req, res) => {
  try {
    // Define scopes for Google OAuth
    const scopes = [
      "profile",
      "email",
      "https://www.googleapis.com/auth/calendar",      // Full access to Calendar
      "https://www.googleapis.com/auth/spreadsheets",  // Full access to Google Sheets
      "https://www.googleapis.com/auth/youtube",       // Full access to YouTube
      "https://mail.google.com/",                       // Full access to Gmail
    ];

    // Generate consent screen URL
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline", // Request refresh token
      prompt: "consent",
      scope: scopes,
    });

    // Redirect user to Google OAuth consent screen
    res.redirect(url);
  } catch (error) {
    console.error("❌ Error in auth route:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
};

// ============================
// 🔹 Step 2: Google OAuth Callback
// ============================
export const callBack = async (req, res) => {
  try {
    const { code } = req.query;
    console.log("Authorization code received:", code);

    // Exchange authorization code for access & refresh tokens
    const { tokens } = await oauth2Client.getToken(code);

    console.log("OAuth Tokens:", tokens);
    console.log("Tokens received:", tokens || "Nothing found!");

    oauth2Client.setCredentials(tokens);

    // Initialize Google OAuth2 API to fetch user info
    const oauth = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const { data: userInfo } = await oauth.userinfo.get();
  

    // ============================
    // 🔹 Step 3: Save or Update User in DB
    // ============================
    let user = await User.findOne({ googleId: userInfo.id });

    if (!user) {
      // First-time login → create new user
      user = await User.create({
        googleId: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      });
    } else {
      // Existing user → update tokens
      user.accessToken = tokens.access_token;
      user.refreshToken = tokens.refresh_token || user.refreshToken;
      user.tokenExpiry = tokens.expiry_date ? new Date(tokens.expiry_date) : user.tokenExpiry;
      await user.save();
    }
    
 
    // ============================
    // 🔹 Step 4: Create JWT & Send to Frontend
    // ============================
  
    createJWT_Token(user.email, res);


    res.redirect("https://lumo-opal.vercel.app/chat");
  
  } catch (error) {
    console.error("❌ Error in callback:", error);
    res.status(500).json({ message: "Callback failed" });
  }
};




/**
 * check auth
 */ 

export const checkAuth = async(req,res) =>{
    try {

        
        if(!req.user){
            return res.status(401).json({ message: "Unauthorized: User not logged in" });

        }else{


            return res.status(200).json({
                status : "success",
                message : "User is logged in",
                user : req.user,
            })
        }
    } catch (error) {
        console.log("❌ Error in checkAuth:", error);
        res.status(500).json({ message: "Could not verify user" });
    }
}


/**
 * logout
 */

export const logout = (req, res) => {
  try {
    res.clearCookie("token");   
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("❌ Error in logout:", error);
    res.status(500).json({ message: "Logout failed" });
  }
};

