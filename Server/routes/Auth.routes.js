import express from "express"
import { auth , callBack } from "../controllers/Auth.js";


const router = express.Router()

router.get("/auth" , auth)
router.get("/callback" , callBack)
export default router;