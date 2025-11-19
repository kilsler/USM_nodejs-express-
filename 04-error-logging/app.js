import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { notFound } from "./controller/errorController.js";
import todoRouter from "./routes/todosRouter.js";
import categoriesRouter from "./routes/categoriesRouter.js"
import authRouter from "./routes/authRouter.js";
import errorHandler from "./middlewares/errorHandler.js";
import adminRouter from "./routes/adminRouter.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
let jwtSecretKey = process.env.JWT_SECRET_KEY;


app.use(express.json())
app.use("/api/todo", todoRouter)
app.use("/api/categories", categoriesRouter);
app.use("/api/auth", authRouter);
app.use("/api/tools", adminRouter)
app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () =>
    console.log(`${process.env.APP_NAME} запущено на порту http://localhost:${PORT}`)
);
