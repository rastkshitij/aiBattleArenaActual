import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken } from "../utils/token.js";
const setAuthCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};
export const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const normalizedEmail = String(email).toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        if (String(password).length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        const hashedPassword = await bcrypt.hash(String(password), 10);
        const user = await User.create({
            email: normalizedEmail,
            password: hashedPassword,
        });
        if (!user) {
            return res.status(500).json({ message: "Registration failed" });
        }
        const token = signToken(String(user._id));
        setAuthCookie(res, token);
        return res.status(201).json({
            message: "User registered successfully",
            user: { id: user._id, email: user.email },
        });
    }
    catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({ message: "Registration failed" });
    }
};
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const normalizedEmail = String(email).toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isPasswordValid = await bcrypt.compare(String(password), user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = signToken(String(user._id));
        setAuthCookie(res, token);
        return res.status(200).json({
            message: "Login successful",
            user: { id: user._id, email: user.email },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Login failed" });
    }
};
export const logoutUser = (_req, res) => {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
};
export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user: { id: user._id, email: user.email } });
    }
    catch (error) {
        console.error("Get current user error:", error);
        return res.status(500).json({ message: "Unable to fetch user" });
    }
};
//# sourceMappingURL=auth.controller.js.map