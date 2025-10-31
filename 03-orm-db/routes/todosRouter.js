import express from 'express';
import {
    getAll,
    getById,
    create,
    update,
    toggle,
    remove
} from '../controller/todosController.js';

const todoRouter = express.Router();

todoRouter.get('/', getAll);
todoRouter.get('/:id', getById);
todoRouter.post('/', create);
todoRouter.put('/:id', update);
todoRouter.patch('/:id/toggle', toggle);
todoRouter.delete('/:id', remove);

export default todoRouter;
