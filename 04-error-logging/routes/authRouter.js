import express from "express";
import { register, login, getProfile } from "../controller/userController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { loginValidator, registerValidator } from "../validators/authValidator.js";

const router = express.Router();

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.get("/profile", authenticateToken, getProfile);
export default router;
