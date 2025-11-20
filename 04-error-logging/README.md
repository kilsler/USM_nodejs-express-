# Лабораторная работа №4 Обработка ошибок, валидация и логгирование

## Цель работы
Целью данной лабораторной работы является изучение методов обработки ошибок, валидации данных и логгирования в приложениях на Node.JS с использованием Express.
## Условие
Реализовать следующие пункты: 
1. Обработка ошибок
2. Валидация данных
3. Логгирование
## Выполнение 
### Обработка ошибок
Для классификации ошибок были созданы собственные классы  
<img width="312" height="170" alt="image" src="https://github.com/user-attachments/assets/d0e58992-82b1-419e-a39b-56584d783c0e" />  
Основной класс ошибки
```js
export class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
```
Кастомный класс для более специфичной записи ошибки 
```js
import { AppError } from './AppError.js';

export class ValidationError extends AppError {
    constructor(message = 'Validation failed', errors = []) {
        super(message, 400);
        this.errors = errors;
    }
}
```
Классы UnathorizedError.js , NotFound.js, DatabaseError,js , AuthenticationError.js так же расширяют класс AppError с целью более специфичной записи ошибки.  
Для обработки ошибок был создан мидлвейр errorHandler.js целью которого является запись ошибок в консоль, отправка ошибки пользователю и создания лога о ошибки при помощи логгера.  
```js
import { AppError } from '../errors/AppError.js';
import { logger } from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {

    const isOperational = err.isOperational !== false;
    const statusCode = err.statusCode || 500;
    const message =
        statusCode === 500
            ? 'Internal Server Error'
            : err.message || 'Error';

    logger.error("Request failed", {
        message: err.message,
        statusCode,
        stack: err.stack,
        isOperational,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get("User-Agent"),
        userId: req.user?.id || null,
        validationErrors: err.errors || null,
        errorType: err.constructor.name,
    });

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: "error",
            message: err.message,
            ...(err.errors && { errors: err.errors }),
        });
    }

    console.error('Error :', err);


    res.status(statusCode).json({
        status: "error",
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

export default errorHandler;
```  
### Валидация данных
Для валидации данных был использован ``` express-validator ```.
Были созданы схемы для : Пользователй(вход и регистрация), для задач todo(создание и изменение).
Пример сеозданная схема для пользователя:
```js
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
```
### Логгирование 
Логирование выполнено при помощи библиотеки ``` winston ```.   
2 типа логов : 
1. Ошибки
2. Вход пользователей
Логи созраняются в разные файлы и имеют разную структуру.

## Контрольные вопросы
1. Какие преимущества централизованной обработки ошибок в Express? Централизованная обработка ошибок в Express обеспечивает единый формат ответов, устраняет дублирование try/catch и упрощает логирование.
2. Какие категории логов вы решили вести в системе и чем обусловлен ваш выбор? Мы ведём error.log (критические ошибки) и users.log (аудит входов/регистраций) — для быстрого поиска багов и соответствия требованиям безопасности.
3. Какие существуют подходы к валидации данных в Express и какие из них вы использовали? Используем express-validator с кастомным middleware, который кидает ValidationError — это даёт мощную валидацию и единый обработчик ошибок без ручных проверок.
