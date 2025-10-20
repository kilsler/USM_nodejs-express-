import express from "express";
import {
    listTodos,
    showNewForm,
    createTodo,
    toggleTodo,
    deleteTodo,
} from "../controller/toDoController.js";
import { showAbout } from "../controller/aboutController.js";

const router = express.Router();

router.get("/", listTodos);
router.get("/new", showNewForm);
router.post("/new", createTodo);
router.post("/:id/toggle", toggleTodo);
router.post("/:id/delete", deleteTodo);
router.get("/about", showAbout);

export default router;
