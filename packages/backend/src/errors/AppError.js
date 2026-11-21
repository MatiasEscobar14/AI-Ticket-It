export class AppError extends Error {
    constructor(message, status = 500) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        this.statusCode = status;
        this.timestamp = new Date().toISOString();
    }
}

export class BadRequestError extends AppError {
    constructor(message, details = []) {
        super(message, 400);
        this.details = details;
    }
}

export class NotFoundError extends AppError {
    constructor(message) {
        super(message, 404);
    }
}

export class ConflictError extends AppError {
    constructor(message) {
        super(message, 409);
    }
}

export class UnprocessableEntityError extends AppError {
    constructor(message) {
        super(message, 422);
    }
}
