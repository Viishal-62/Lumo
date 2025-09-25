import jwt from "jsonwebtoken";
import { ENV } from "../Config/envConfig.js";
import { v2 as cloudinary } from "cloudinary";  
 

// ============================
// 🔹 Google Calendar Event Helper
// ============================
 
export const createCalendarEvent = ({ start, end, summary, description, location, attendees }) => ({
  start: { dateTime: start, timeZone: "Asia/Kolkata" },
  end: { dateTime: end, timeZone: "Asia/Kolkata" },
  summary,
  description,
  location,
  attendees: (attendees || []).map(a => ({
    email: a.email,
    displayName: a.displayName,
  })),
  reminders: {
    useDefault: false,
    overrides: [
      { method: "email", minutes: 30 },
      { method: "popup", minutes: 10 },
    ],
  },
  conferenceData: {
    createRequest: {
      requestId: `${Date.now()}`, // unique request ID
      conferenceSolutionKey: { type: "hangoutsMeet" },
    },
  },
});

// ============================
// 🔹 Cloudinary File Upload Helper
// ============================
 
export const uploadToCloudinary = async (filePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, { folder });
    console.log("Cloudinary upload result:", result);
    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

// ============================
// 🔹 JWT Token Creation Helper
// ============================
 
 
export const createJWT_Token = (emailId, res) => {
  try {
    const token = jwt.sign({ emailId }, ENV.JWT_SECRET_KEY, { expiresIn: "7d" });

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: ENV.NODE_ENV === "production", // use secure cookies in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return token;
  } catch (error) {
    console.error("Error creating JWT token:", error);
    throw error;
  }
};


export const decode_token = (token) =>{
   try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET_KEY);
    return decoded;
   }catch (error) {
    console.error("Error decoding JWT token:", error);
    throw error;
   }
}

// utils/getGoogleClient.js
 
// utils/googleClient.js
import { google } from "googleapis";
import { User } from "../Model/usermodel.js";
import { oauth2Client } from "../controllers/Auth.js";// your initialized OAuth2 client

export async function getGoogleClient(email) {
  const user = await User.findOne({ email });
  if (!user || !user.accessToken) throw new Error("No Google tokens found for this user");

  console.log("🔑 Setting OAuth2 credentials for", email);

  oauth2Client.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken, // make sure this is stored permanently
    expiry_date: user.tokenExpiry?.getTime(),
  });

  // Automatically refresh the access token if it's expired
  oauth2Client.on("tokens", async (tokens) => {
    if (tokens.refresh_token) user.refreshToken = tokens.refresh_token;
    if (tokens.access_token) {
      user.accessToken = tokens.access_token;
      user.tokenExpiry = tokens.expiry_date ? new Date(tokens.expiry_date) : null;
    }
    await user.save();
    console.log("🔄 Tokens refreshed and saved to DB");
  });

    return {
    calendar: google.calendar({ version: "v3", auth : oauth2Client}),
    sheets: google.sheets({ version: "v4", auth : oauth2Client }),
    gmail: google.gmail({ version: "v1", auth  : oauth2Client  }),
    youtube: google.youtube({ version: "v3", auth : oauth2Client  }),
  }
}
