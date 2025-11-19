import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthenticationError } from "../errors/AuthenticationError.js";

dotenv.config();

const verifyJwtToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        throw new AuthenticationError("Invalid or expired token.");
    }
};

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        throw new AuthenticationError("Access denied. No token provided.");
    }

    try {
        const user = verifyJwtToken(token);
        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};

export const authenticateTokenAdmin = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && req.headers.authorization.split(" ")[1];
    if (!token) {
        throw new AuthenticationError("Access denied. No token provided.");
    }
    if (!token) throw new AuthenticationError("No token provided");

    try {
        const user = verifyJwtToken(token);
        if (user.role !== "admin") {
            throw new UnauthorizedError("Admin role required");
        }
        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};