import { decode_token } from "../utils/Helper.js";
import { User } from "../Model/usermodel.js";
 

export const isAuthorized = async(req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }
        const decoded = decode_token(token);

            const finduser =  await User.findOne({ email: decoded.emailId });

            if (!finduser) {
                return res.status(401).json({ message: "Unauthorized: User not found" });
            }

            let user = {
                  name : finduser.name,
                  email : finduser.email,
                  picture : finduser.picture,
                  
            }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};