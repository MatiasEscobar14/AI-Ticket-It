import { describe, expect, test } from '@jest/globals';
import { EstadoCompra } from '../../../src/domain/EstadoCompra.js';

describe('EstadoCompra', () => {
    test('expone los estados válidos de compra', () => {
        expect(Object.values(EstadoCompra)).toEqual([
            'pendiente',
            'confirmada',
            'utilizada',
            'cancelada',
            'reembolsada',
        ]);
    });

    test('no permite modificar el catálogo de estados', () => {
        expect(Object.isFrozen(EstadoCompra)).toBe(true);
    });
});
