import express from "express";
import dotenv from "dotenv";
import { notFound } from "./controller/errorController.js";
import todoRouter from "./routes/todosRouter.js";
import categoriesRouter from "./routes/categoriesRouter.js"
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use("/api/todo", todoRouter)
app.use("/api/categories", categoriesRouter);
app.use(notFound);

app.listen(PORT, () =>
    console.log(`${process.env.APP_NAME} запущено на порту http://localhost:${PORT}`)
);
