import express from "express";
import dotenv from "dotenv";
import path from "path";
import router from "./routes/index.js";
import { notFound } from "./controller/errorController.js";

dotenv.config();
const app = express();
const __dirname = path.resolve();

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use("/", router);
app.use(notFound);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
    console.log(`${process.env.APP_NAME} запущено на порту ${PORT}`)
);
