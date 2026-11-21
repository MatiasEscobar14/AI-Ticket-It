import { describe, expect, test } from '@jest/globals';
import CambioEstadoCompra from '../../../src/domain/CambioEstadoCompra.js';
import { EstadoCompra } from '../../../src/domain/EstadoCompra.js';
import { DomainValidationError } from '../../../src/domain/Errors/DomainError.js';

describe('CambioEstadoCompra', () => {
    test('se construye correctamente con los parámetros requeridos', () => {
        const antes = Date.now();
        const cambioEstado = new CambioEstadoCompra('compra-id', EstadoCompra.PENDIENTE, 'usuario-id');

        expect(cambioEstado.compra).toBe('compra-id');
        expect(cambioEstado.estado).toBe(EstadoCompra.PENDIENTE);
        expect(cambioEstado.quien).toBe('usuario-id');
        expect(cambioEstado.fechaHora).toBeInstanceOf(Date);
        expect(cambioEstado.fechaHora.getTime()).toBeGreaterThanOrEqual(antes);
    });

    test('rechaza la falta de compra, estado o usuario', () => {
        expect(() => new CambioEstadoCompra(undefined, EstadoCompra.PENDIENTE, 'usuario-id'))
            .toThrow(DomainValidationError);
        expect(() => new CambioEstadoCompra('compra-id', undefined, 'usuario-id'))
            .toThrow(DomainValidationError);
        expect(() => new CambioEstadoCompra('compra-id', EstadoCompra.PENDIENTE, undefined))
            .toThrow(DomainValidationError);
    });

    test('rechaza un estado de compra que no pertenece a los estados válidos', () => {
        expect(() => new CambioEstadoCompra('compra-id', 'desconocido', 'usuario-id'))
            .toThrow(DomainValidationError);
    });
});
