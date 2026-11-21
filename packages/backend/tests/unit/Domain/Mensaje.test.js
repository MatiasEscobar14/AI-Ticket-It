import { describe, expect, test } from '@jest/globals';
import Mensaje from '../../../src/domain/Mensaje.js';
import { DomainValidationError } from '../../../src/domain/Errors/DomainError.js';

describe('Mensaje', () => {
    test('se construye correctamente y registra la fecha de envío', () => {
        const antes = Date.now();
        const mensaje = new Mensaje('usuario-id', 'Hola');

        expect(mensaje.usuario).toBe('usuario-id');
        expect(mensaje.mensaje).toBe('Hola');
        expect(mensaje.enviado).toBeInstanceOf(Date);
        expect(mensaje.enviado.getTime()).toBeGreaterThanOrEqual(antes);
    });

    test('rechaza un usuario ausente', () => {
        expect(() => new Mensaje(undefined, 'Hola')).toThrow(DomainValidationError);
    });

    test('rechaza un contenido ausente, vacío o de tipo incorrecto', () => {
        expect(() => new Mensaje('usuario-id', undefined)).toThrow(DomainValidationError);
        expect(() => new Mensaje('usuario-id', '   ')).toThrow(DomainValidationError);
        expect(() => new Mensaje('usuario-id', 123)).toThrow(DomainValidationError);
    });
});