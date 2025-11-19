import express from "express";
import { logs } from "../controller/adminController.js";
import { authenticateTokenAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/logs", authenticateTokenAdmin, logs);

export default router;
