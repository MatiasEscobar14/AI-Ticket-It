import { BadRequestError, UnprocessableEntityError } from '../../errors/AppError.js';

export class DomainValidationError extends BadRequestError {
    constructor(message) {
        super(message);
        this.name = 'DomainValidationError';
    }
}

export class DomainRuleError extends UnprocessableEntityError {
    constructor(message) {
        super(message);
        this.name = 'DomainRuleError';
    }
}