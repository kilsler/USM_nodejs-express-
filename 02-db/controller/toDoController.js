import { getAll, add, toggle, remove } from "../model/toDo.js";

export async function listTodos(req, res) {
    try {
        const status = req.query.status || 'all';
        const todos = await getAll(status);
        res.render("index", { title: "Список задач", todos, status });
    } catch (err) {
        console.error("Ошибка при получении списка задач:", err);
        res.status(500).send("Ошибка сервера");
    }
}

export function showNewForm(req, res) {
    res.render("new", { title: "Новая задача" });
}

export async function createTodo(req, res) {
    try {
        const { title } = req.body;
        if (title && title.trim() !== "") {
            await add(title.trim());
        }
        res.redirect("/");
    } catch (err) {
        console.error("Ошибка при добавлении задачи:", err);
        res.status(500).send("Ошибка сервера");
    }
}

export async function toggleTodo(req, res) {
    try {
        await toggle(req.params.id);
        res.redirect("/");
    } catch (err) {
        console.error("Ошибка при переключении задачи:", err);
        res.status(500).send("Ошибка сервера");
    }
}

export async function deleteTodo(req, res) {
    try {
        await remove(req.params.id);
        res.redirect("/");
    } catch (err) {
        console.error("Ошибка при удалении задачи:", err);
        res.status(500).send("Ошибка сервера");
    }
}
