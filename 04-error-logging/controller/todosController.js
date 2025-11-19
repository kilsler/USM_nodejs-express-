import {
    getAllToDo,
    addToDo,
    toggleToDo,
    removeToDo,
    updateToDo,
    getByIdToDo,
    getAllByUser
} from '../model/toDo.js';
import asyncHandler from "../middlewares/asyncHandler.js";
import { NotFoundError } from '../errors/NotFoundError.js';
export const getAll = asyncHandler(async function (req, res) {
    const todos = await getAllToDo(req.query);
    res.status(200).json({
        status: "success",
        data: todos,
    })
})
export const getById = asyncHandler(async function (req, res) {
    const todo = await getByIdToDo(req.params.id);
    if (!todo) {
        throw new NotFoundError("Todo not found");
    }
    res.status(200).json({
        status: "success",
        data: todo,
    })
})
export const getAllUser = asyncHandler(async function (req, res) {
    const todos = await getAllByUser(req.user.id, req.query);
    res.status(200).json({
        status: "success",
        data: todos,
    });
});

export const create = asyncHandler(async function (req, res) {
    const { title, category_id, due_date } = req.body;
    const user_id = req.user.id;

    if (!title || title.trim() === "") {
        throw new ValidationError("Title is required", [
            { field: "title", message: "Title cannot be empty" },
        ]);
    }

    const newTodo = await addToDo(title.trim(), category_id, due_date, user_id);

    res.status(201).json({
        status: "success",
        message: "Todo created successfully",
        data: newTodo,
    });
});

export const update = asyncHandler(async function (req, res) {
    const success = await updateToDo(req.params.id, req.body);

    if (!success) {
        throw new NotFoundError("Todo");
    }

    res.status(200).json({
        status: "success",
        message: "Todo updated successfully",
        data: { id: req.params.id, ...req.body },
    });
});

export const toggle = asyncHandler(async function (req, res) {
    const result = await toggleToDo(req.params.id);

    if (!result) {
        throw new NotFoundError("Todo not found");
    }

    res.status(200).json({
        status: "success",
        data: result,
    });
});

export const remove = asyncHandler(async function (req, res) {
    const success = await removeToDo(req.params.id);

    if (!success) {
        throw new NotFoundError("Todo not found");
    }

    res.status(204).send();
});