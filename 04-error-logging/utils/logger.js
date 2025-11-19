// utils/logger.js
import winston from "winston";

export const logger = winston.createLogger({
    level: "info",

    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),

    transports: [
        // Логи об ошибках в файл
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
        }),

        // Все логи в файл
        new winston.transports.File({
            filename: "logs/combined.log",
        }),

        ...(process.env.NODE_ENV !== "production"
            ? [new winston.transports.Console()]
            : []),
    ],
});