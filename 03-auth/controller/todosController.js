import {
    getAllToDo,
    addToDo,
    toggleToDo,
    removeToDo,
    updateToDo,
    getByIdToDo,
    getAllByUser
} from '../model/toDo.js';

export async function getAll(req, res) {
    try {
        const todos = await getAllToDo(req.query);
        res.status(200).json(todos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function getById(req, res) {
    try {
        const todo = await getByIdToDo(req.params.id);
        if (!todo) return res.status(404).json({ message: 'Todo not found' });
        res.json(todo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
export async function getAllUser(req, res) {
    try {
        const todos = await getAllByUser(req.user.id, req.query);
        res.status(200).json(todos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
export async function create(req, res) {
    try {
        const { title, category_id, due_date } = req.body;
        const user_id = req.user.id;
        if (!title) return res.status(400).json({ message: 'Title is required' });
        const newTodo = await addToDo(title, category_id, due_date, user_id);
        res.status(201).json(newTodo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function update(req, res) {
    try {
        const success = await updateToDo(req.params.id, req.body);
        if (!success) return res.status(404).json({ message: 'Todo not found' });
        res.json({ id: req.params.id, ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function toggle(req, res) {
    try {
        const result = await toggleToDo(req.params.id);
        if (!result) return res.status(404).json({ message: 'Todo not found' });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function remove(req, res) {
    try {
        const success = await removeToDo(req.params.id);
        if (!success) return res.status(404).json({ message: 'Todo not found' });
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
