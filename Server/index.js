 

import express from "express";
import { configDotenv } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "./src/Config/envConfig.js";
import { connectDB } from "./src/Config/Database.js";
import googleAuth from "./src/routes/Auth.routes.js";

// ✅ Load environment variables from .env
configDotenv();

const PORT = ENV.PORT || 5000;
const app = express();

// =============================
// 🔗 Middleware Configuration
// =============================

// ✅ Enable CORS (allows requests from frontend & sends cookies)
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL (Vite default)
    credentials: true, // Required for sending cookies with requests
  })
);

// ✅ Parse cookies (used for storing JWT securely)
app.use(cookieParser());

// ✅ Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// ✅ Parse JSON requests (limit body size to 10MB)
app.use(express.json({ limit: "10mb" }));

// =============================
// 📌 Routes
// =============================

// ✅ Google OAuth routes (Login, Callback, Logout)
app.use("/api", googleAuth);

// ✅ Health check route (useful for monitoring and uptime checks)
app.get("/health", (req, res) => {
  res.status(200).json({ message: "✅ Lumo AI Backend is running!" });
});

// =============================
// 🗄️ Database Connection & Server Start
// =============================

// Connect to MongoDB first, then start the server
connectDB()
  .then(() => {
    console.log("✅ Connected to MongoDB");

    // Start Express server only after DB connection is successful
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1); // Exit process if DB connection fails
  });
