import express from 'express';
import {
    listCategories,
    getCategory,
    addCategory,
    editCategory,
    removeCategory

} from '../controller/categoriesController.js';


const categoriesRouter = express.Router();

categoriesRouter.get('/', listCategories);
categoriesRouter.get('/:id', getCategory);
categoriesRouter.post('/', addCategory);
categoriesRouter.put('/:id', editCategory);
categoriesRouter.delete('/:id', removeCategory);

export default categoriesRouter;
