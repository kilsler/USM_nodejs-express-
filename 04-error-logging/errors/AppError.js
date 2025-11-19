export class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);

        this.statusCode = statusCode;

        // Маркируем как операционную ошибку
        this.isOperational = isOperational;

        // Захватываем стек вызовов, исключая конструктор
        Error.captureStackTrace(this, this.constructor);
    }
}