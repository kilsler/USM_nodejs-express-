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

export const registerValidator = [
    body('username')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('username should have at least 2 to 50 symbols '),

    body('email')
        .isEmail()
        .withMessage('invalid email')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 6 })
        .withMessage('password must have at least 6 symbols')
        .matches(/\d/)
        .withMessage('password must have at least 1 number')
        .matches(/[A-Z]/)
        .withMessage('password must have at least 1 Uppercase letter'),
    validate
];

export const loginValidator = [
    body('email')
        .isEmail()
        .withMessage('Enter valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    validate
];