import { describe, expect, test } from '@jest/globals';
import Usuario from '../../../src/domain/Usuario.js';
import { DomainValidationError } from '../../../src/domain/Errors/DomainError.js';

describe('Usuario', () => {
    test('se construye correctamente con nombre, apellido y favoritos', () => {
        const usuario = new Usuario('Ana', 'Pérez', ['evento-id']);

        expect(usuario.nombre).toBe('Ana');
        expect(usuario.apellido).toBe('Pérez');
        expect(usuario.favoritos).toEqual(['evento-id']);
    });

    test('inicializa los favoritos con una lista vacía si no se proporcionan', () => {
        const usuario = new Usuario('Ana', 'Pérez');

        expect(usuario.favoritos).toEqual([]);
    });

    test('rechaza nombres y apellidos ausentes, vacíos o de tipo incorrecto', () => {
        expect(() => new Usuario(undefined, 'Pérez')).toThrow(DomainValidationError);
        expect(() => new Usuario('   ', 'Pérez')).toThrow(DomainValidationError);
        expect(() => new Usuario(12, 'Pérez')).toThrow(DomainValidationError);
        expect(() => new Usuario('Ana', undefined)).toThrow(DomainValidationError);
        expect(() => new Usuario('Ana', '   ')).toThrow(DomainValidationError);
        expect(() => new Usuario('Ana', 12)).toThrow(DomainValidationError);
    });

    test('agregarFavorito agrega un evento a la lista', () => {
        const usuario = new Usuario('Ana', 'Pérez');

        usuario.agregarFavorito('evento-id');

        expect(usuario.favoritos).toEqual(['evento-id']);
    });
});