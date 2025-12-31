import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import {redisClient} from "../lib/redis.js";

const generateToken = (userId) => {
    const accessToken = jwt.sign({id: userId}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    }); 

    const refreshToken = jwt.sign({id: userId}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });

    return { accessToken, refreshToken };
}

const storeRefreshToken = async (userId, refreshToken) => {
    await redisClient.set(
        `refreshToken:${userId}`,
        refreshToken,
        "EX",
        7 * 24 * 60 * 60); //7 days expiration
}   

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 15 * 60 * 1000, //15 minutes
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    }); 
}

export const signup = async (req, res) => {
    const { email , password, name } = req.body;

    try {
        const userExists = await User.findOne({ email});
        if(userExists) {
            return res.status(400).json({ message: "Email already in use"});    
        }
        const user = await User.create({ email, password, name});

        //generate tokens
        const { accessToken, refreshToken } = generateToken(user._id);

        setCookies(res, accessToken, refreshToken);
        await storeRefreshToken(user._id, refreshToken);

        res.status(201).json({ 
            _id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            message: "User created successfully",
            }); 
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error"
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password} = req.body;
        const user = await User.findOne({ email});

        if(!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: "Invalid email or password"});
        }

        const { accessToken, refreshToken } = generateToken(user._id);
        await storeRefreshToken(user._id, refreshToken);
        setCookies(res, accessToken, refreshToken);

        res.status(200).json({
            _id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            message: "Login successful",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error"});
    }
};

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            await redisClient.del(`refreshToken:${decoded.id}`);
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(200).json({ message: "Logout successful"});
    } catch (error) {
        console.log(error); 
        res.status(500).json({ message: "Server error"});
    }
}

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided"});
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const storedToken = await redisClient.get(`refreshToken:${decoded.id}`);

        if(storedToken !== refreshToken) {
            return res.status(403).json({ message: "Invalid refresh token"});
        }

        const { accessToken } = generateToken(decoded.id);
        setCookies (res, accessToken, refreshToken);

        res.status(200).json({ message: "Token refreshed successfully"});           
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error"});
    }
}

export const getProfile = async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ message: "Server error"});       
    }
}