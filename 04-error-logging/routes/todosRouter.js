import express from 'express';
import {
    getAll,
    getById,
    create,
    update,
    toggle,
    remove,
    getAllUser
} from '../controller/todosController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { todoValidator } from '../validators/todoValidator.js';

const todoRouter = express.Router();

todoRouter.get('/:id', getById);

todoRouter.get('/', authenticateToken, getAllUser);
todoRouter.post('/', todoValidator, authenticateToken, create);
todoRouter.put('/:id', todoValidator, authenticateToken, update);
todoRouter.patch('/:id/toggle', authenticateToken, toggle);
todoRouter.delete('/:id', authenticateToken, remove);

export default todoRouter;
