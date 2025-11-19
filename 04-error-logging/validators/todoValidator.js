import { body, validationResult } from 'express-validator';
import { ValidationError } from '../errors/ValidationError.js';

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorDetails = errors.array().map(err => ({
            field: err.param,
            message: err.msg,
        }));
        throw new ValidationError("Validation failed", errorDetails);
    }
    next();
};

export const todoValidator = [
    body('title')
        .trim()
        .isLength({ min: 1, max: 255 })
        .withMessage('Title must be between 1 and 255 characters'),

    body('category_id')
        .isInt({ min: 1 })
        .withMessage('Category ID must be a positive integer'),

    body('due_date')
        .isISO8601()
        .toDate()
        .withMessage('Due date must be a valid date (YYYY-MM-DD)'),

    body('user_id')
        .not().exists({ checkNull: true })
        .withMessage('You cannot set user_id manually'),

    body('completed')
        .optional()
        .isBoolean()
        .toBoolean()
        .withMessage('Completed must be true or false'),
    validate,
];
