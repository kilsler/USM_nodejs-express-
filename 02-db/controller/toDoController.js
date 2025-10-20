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

////////
import { getAllUsers, getUserById, addUser, updateUser } from '../models/user.js';

export async function listUsers(req, res) {
  const users = await getAllUsers();
  return res.json(users);
}

export async function getUser(req, res) {
  const user = await getUserById(req.params.id);
  if (user) {
    return res.json(user);
  } else {
    return res.status(404).send('User not found');
  }
}

export async function createUser(req, res) {
  const { name, email } = req.body;
  await addUser(name, email);
  return res.status(201).send('User created');
}

export async function editUser(req, res) {
  const { name, email } = req.body;
  await updateUser(req.params.id, name, email);
  return res.send('User updated');
}