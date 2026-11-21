import { describe, expect, test } from '@jest/globals';
import Categoria from '../../../src/domain/Categoria.js';
import { DomainValidationError } from '../../../src/domain/Errors/DomainError.js';

describe('Categoria', () => {
    test('se construye correctamente con nombre y descripción', () => {
        const categoria = new Categoria('Música', 'Conciertos en vivo');

        expect(categoria.nombre).toBe('Música');
        expect(categoria.descripcion).toBe('Conciertos en vivo');
    });

    test('rechaza un nombre ausente, vacío o de tipo incorrecto', () => {
        expect(() => new Categoria(undefined, 'Descripción')).toThrow(DomainValidationError);
        expect(() => new Categoria('   ', 'Descripción')).toThrow(DomainValidationError);
        expect(() => new Categoria(12, 'Descripción')).toThrow(DomainValidationError);
    });

    test('rechaza una descripción ausente, vacía o de tipo incorrecto', () => {
        expect(() => new Categoria('Música', undefined)).toThrow(DomainValidationError);
        expect(() => new Categoria('Música', '   ')).toThrow(DomainValidationError);
        expect(() => new Categoria('Música', 12)).toThrow(DomainValidationError);
    });
});