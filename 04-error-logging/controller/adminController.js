import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { AppError } from "../errors/AppError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOGS_PATH = path.join(__dirname, "../logs/combined.log");

const DEFAULT_LINES = 100;

export const logs = (req, res) => {
    try {
        if (!fs.existsSync(LOGS_PATH)) {
            return res.status(200).json({
                success: true,
                message: "Log file not found (yet)",
                logs: [],
                total: 0,
            });
        }

        const fileContent = fs.readFileSync(LOGS_PATH, "utf-8");
        const lines = fileContent.trim().split("\n");

        const recentLines = lines.slice(-DEFAULT_LINES);

        const parsedLogs = recentLines
            .filter(line => line.trim() !== "")
            .map(line => {
                try {
                    return JSON.parse(line);
                } catch {
                    return { raw: line };
                }
            });

        res.status(200).json({
            success: true,
            total: lines.length,
            displayed: parsedLogs.length,
            logs: parsedLogs.reverse(),
        });
    } catch (err) {
        throw new AppError("Failed to read logs", 500);
    }
};