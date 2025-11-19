import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createUser, findUserByEmail, findUserById, findUserByNameOrEmail } from "../model/user.js";
import bcrypt from "bcrypt";
import asyncHandler from "../middlewares/asyncHandler.js";
import { ValidationError } from "../errors/ValidationError.js";
import { AppError } from "../errors/AppError.js";
import { NotFoundError } from "../errors/NotFoundError.js";

dotenv.config();


export const register = asyncHandler(async function (req, res) {
    const { username, email, password } = req.body;
    const existingUser = await findUserByNameOrEmail(username, email);
    if (existingUser) {
        throw new ValidationError("User already exists", [
            { field: "email/login", message: "User with this email or username already exists" },
        ]);
    }
    const password_hash = bcrypt.hashSync(password, 10);
    const user = await createUser(username, email, password_hash);
    res.status(201).json({
        status: "success",
        message: "User registered successfully",
        data: { id: user.id, username: user.username, email: user.email },
    });

})

export const login = asyncHandler(async function (req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ValidationError("Email and password required");
    }

    const user = await findUserByEmail(email);
    if (!user) {
        throw new ValidationError("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ValidationError("Invalid email or password");
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role || "user" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({
        status: "success",
        message: "Login successful",
        token,
    });
});

export const getProfile = asyncHandler(async function (req, res) {
    const user = await findUserById(req.user.id);
    if (!user) {
        throw new NotFoundError("User not found");
    }
    res.json({
        status: "success",
        data: {
            username: user.username,
            created_at: user.created_at,
            email: user.email,
        }
    })
})