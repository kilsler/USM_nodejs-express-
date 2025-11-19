import { AppError } from './AppError.js';

export class DatabaseError extends AppError {
    constructor(message = 'Database operation failed', originalError = null) {
        super(message, 500);
        this.originalError = originalError;
    }
}