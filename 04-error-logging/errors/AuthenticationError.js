import { AppError } from './AppError.js';

export class AuthenticationError extends AppError {
    constructor(message = 'Требуется авторизация') {
        super(message, 401);
    }
}

