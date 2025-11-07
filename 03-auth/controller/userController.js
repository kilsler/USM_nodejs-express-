import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createUser, findUserByEmail, findUserById } from "../model/user.js";
import bcrypt from "bcrypt";

dotenv.config();

export async function register(req, res) {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        const password_hash = bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                return res.status(400).json({ message: err.message })
            } else if (hash) {
                console.log(hash);
                const user = await createUser(username, email, hash);
                res.status(201).json({ message: "User registered successfully", user });
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }


        if (bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.log(err.message);
            } else if (result) {
                const token = jwt.sign(
                    { id: user.id, email: user.email },
                    process.env.JWT_SECRET,
                    { expiresIn: "1h" }
                );
                res.json({ message: "Login successful", token });
            } else {
                return res.status(401).json({ message: "Invalid email or password" });
            }
        }))
            if (password !== user.password) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

export async function getProfile(req, res) {
    try {
        const user = await findUserById(req.user.id);
        console.log(user)
        if (user) {
            return res.json({
                username: user.username,
                created_at: user.created_at,
                email: user.email
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}
