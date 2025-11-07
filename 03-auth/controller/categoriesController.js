import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../model/categories.js";

export async function listCategories(req, res) {
    try {
        const categories = await getAllCategories();
        res.status(200).json(categories);
    } catch (err) {
        console.error("Ошибка при получении категорий:", err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
}

export async function getCategory(req, res) {
    try {
        const category = await getCategoryById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: "Категория не найдена" });
        }
        res.status(200).json(category);
    } catch (err) {
        console.error("Ошибка при получении категории:", err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
}

export async function addCategory(req, res) {
    try {
        const { name } = req.body;
        if (!name || name.trim() === "") {
            return res.status(400).json({ error: "Название категории обязательно" });
        }
        const newCategory = await createCategory(name.trim());
        res.status(201).json(newCategory);
    } catch (err) {
        console.error("Ошибка при создании категории:", err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
}

export async function editCategory(req, res) {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!name || name.trim() === "") {
            return res.status(400).json({ error: "Название категории обязательно" });
        }

        const updated = await updateCategory(id, name.trim());
        if (!updated) {
            return res.status(404).json({ error: "Категория не найдена" });
        }
        res.status(200).json({ message: "Категория обновлена" });
    } catch (err) {
        console.error("Ошибка при обновлении категории:", err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
}

export async function removeCategory(req, res) {
    try {
        const deleted = await deleteCategory(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: "Категория не найдена" });
        }
        res.status(204).send();
    } catch (err) {
        console.error("Ошибка при удалении категории:", err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
}
