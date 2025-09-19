console.log("🚀 Welcome to Lumo AI Backend");

import express from "express";
import { configDotenv } from "dotenv";
import cors from "cors";
import { ENV } from "./Config/envConfig.js";
import googleAuth from "./routes/Auth.routes.js"

configDotenv();

const PORT = ENV.PORT || 5000;
const app = express();

// Enable CORS
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Enable JSON parsing for all routes
app.use(express.json({ limit: "10mb" }));

app.use("/api" , googleAuth)
 

// Example health check route
app.get("/health", (req, res) => {
    res.send({ message: "Lumo AI Backend is running!" });
});

 

app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
