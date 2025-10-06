import { getAll, add, toggle, remove } from "../model/toDo.js";

export function listTodos(req, res) {
    const todos = getAll();
    res.render("index", { title: "Список задач", todos });
}

export function showNewForm(req, res) {
    res.render("new", { title: "Новая задача" });
}

export function createTodo(req, res) {
    const { title } = req.body;
    if (title && title.trim() !== "") {
        add(title.trim());
    }
    res.redirect("/");
}

export function toggleTodo(req, res) {
    toggle(req.params.id);
    res.redirect("/");
}

export function deleteTodo(req, res) {
    remove(req.params.id);
    res.redirect("/");
}
