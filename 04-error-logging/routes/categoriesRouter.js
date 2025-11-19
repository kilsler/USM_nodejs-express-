import express from 'express';
import {
    listCategories,
    getCategory,
    addCategory,
    editCategory,
    removeCategory

} from '../controller/categoriesController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';


const categoriesRouter = express.Router();

categoriesRouter.get('/', listCategories);
categoriesRouter.get('/:id', getCategory);

categoriesRouter.post('/', authenticateToken, addCategory);
categoriesRouter.put('/:id', authenticateToken, editCategory);
categoriesRouter.delete('/:id', authenticateToken, removeCategory);

export default categoriesRouter;
