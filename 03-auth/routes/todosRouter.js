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

const todoRouter = express.Router();

todoRouter.get('/:id', getById);

todoRouter.get('/', authenticateToken, getAllUser);
todoRouter.post('/', authenticateToken, create);
todoRouter.put('/:id', authenticateToken, update);
todoRouter.patch('/:id/toggle', authenticateToken, toggle);
todoRouter.delete('/:id', authenticateToken, remove);

export default todoRouter;
