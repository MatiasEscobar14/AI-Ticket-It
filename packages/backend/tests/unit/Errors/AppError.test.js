import { afterEach, describe, expect, jest, test } from '@jest/globals';
import {
    AppError,
    BadRequestError,
    ConflictError,
    NotFoundError,
    UnprocessableEntityError,
} from '../../../src/errors/AppError.js';
import { DomainValidationError } from '../../../src/domain/Errors/DomainError.js';
import { errorHandler } from '../../../src/middlewares/errorHandler.js';

describe('AppError', () => {
    afterEach(() => jest.restoreAllMocks());

    test.each([
        [AppError, 500],
        [BadRequestError, 400],
        [NotFoundError, 404],
        [ConflictError, 409],
        [UnprocessableEntityError, 422],
        [DomainValidationError, 400],
    ])('%s conserva el código HTTP %i', (ErrorType, status) => {
        const error = new ErrorType('error de prueba');

        expect(error.status).toBe(status);
        expect(error.statusCode).toBe(status);
        expect(error.timestamp).toBeTruthy();
    });

    test('el middleware responde con el código HTTP del AppError', () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        errorHandler(new NotFoundError('No existe'), {}, response, jest.fn());

        expect(response.status).toHaveBeenCalledWith(404);
        expect(response.json).toHaveBeenCalledWith(expect.objectContaining({
            success: false,
            message: 'No existe',
        }));
    });
});
