import express from "express"
import { auth, callBack, checkAuth, logout } from "../controllers/Auth.js";
import { isAuthorized } from "../Middleware/Authorized.js";
import { run } from "../Config/graph.js";
 


const router = express.Router()

router.get("/auth" , auth)
router.get("/callback" , callBack)
router.post("/logout" , logout)
router.get("/checkauth" , isAuthorized , checkAuth)
router.post("/talk" , isAuthorized , run)

export default router;