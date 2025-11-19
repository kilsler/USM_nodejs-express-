import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../model/categories.js";

import { NotFoundError } from "../errors/NotFoundError.js";
import { ValidationError } from "../errors/ValidationError.js";
import asyncHandler from "../middlewares/asyncHandler.js";


export const listCategories = asyncHandler(async (req, res) => {
    const categories = await getAllCategories();
    res.status(200).json({
        status: "success",
        data: categories,
    });
})


export const getCategory = asyncHandler(async (req, res) => {
    const category = await getCategoryById(req.params.id);

    if (!category) {
        throw new NotFoundError("Категория");
    }
    res.status(200).json({
        status: "success",
        data: category,
    })
})

export const addCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (!name || name.trim() === "") {
        throw new ValidationError("Название категории обязательно", [
            { field: "name", message: "Название не может быть пустым" },
        ]);
    }

    const newCategory = await createCategory(name.trim());

    res.status(201).json({
        status: "success",
        message: "Категория создана",
        data: newCategory,
    });
});

export const editCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === "") {
        throw new ValidationError("Required category nam,e", [
            { field: "name", message: "Название не может быть пустым" },
        ]);
    }

    const updated = await updateCategory(id, name.trim());

    if (!updated) {
        throw new NotFoundError("Category");
    }

    res.status(200).json({
        status: "success",
        message: "Category updated",
    });
});

export const removeCategory = asyncHandler(async (req, res) => {
    const deleted = await deleteCategory(req.params.id);

    if (!deleted) {
        throw new NotFoundError("Category");
    }

    res.status(204).send();
});
