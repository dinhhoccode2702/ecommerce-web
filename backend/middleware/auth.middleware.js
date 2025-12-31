import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js"; 

export const protectRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if(!accessToken) {
            return res.status(401).json({ message: "Unauthorized"});
        }

        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded.id).select("-password");
            if(!user) {
                return res.status(401).json({ message: "Unauthorized"});
            }
            req.user = user;
            next();
        }  catch (error) {
            return res.status(401).json({ message: "Unauthorized"});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error"});   
    }
}

export const adminRoute = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({ message: "Forbidden: Admins only"});
    }
}