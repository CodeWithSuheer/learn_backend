import { User } from "../models/user.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const getAllUser = async (req, res) => {
}

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) {
        return res.status(400).json({
            success: false,
            msg: "User already exists",
        })
    }

    const hashedPassowrd = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashedPassowrd });
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    res.status(201).cookie("token", token, {
        httponly: true,
        maxAge: 15 * 60 * 1000,
    }).json({
        success: true,
        msg: "User created Successfully",
    })
}


export const login = async (req, res) => {
    const { email, password } = req.body;
    let user = await User.findOne({ email }).select("+password");

    if (!user) {
        return res.status(404).json({
            success: false,
            msg: "Invalid Email & Password"
        })
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(404).json({
            success: false,
            msg: "Invalid Email & Password"
        })
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    res.status(200).cookie("token", token, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
        sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
        secure: process.env.NODE_ENV === "Development" ? false : true,
    }).json({
        success: true,
        msg: "Welcome Back",
    })
}

export const getMyProfile = async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    })
}

export const logout = (req, res) => {
    res.status(200).cookie("token", "", {
        expires: new Date(Date.now()),
        sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
        secure: process.env.NODE_ENV === "Development" ? false : true,
    }).json({
        success: true,
        user: req.user
    })
}
