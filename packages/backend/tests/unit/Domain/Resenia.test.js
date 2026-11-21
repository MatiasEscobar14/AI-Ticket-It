import { describe, expect, test } from '@jest/globals';
import Resenia from '../../../src/domain/Resenia.js';
import { DomainValidationError } from '../../../src/domain/Errors/DomainError.js';

describe('Resenia', () => {
    const crearResenia = (datos = {}) => {
        const valores = {
            comprador: 'comprador-id',
            evento: 'evento-id',
            detalle: 'Excelente evento',
            puntuacion: 5,
            ...datos,
        };
        return new Resenia(
            valores.comprador,
            valores.evento,
            valores.detalle,
            valores.puntuacion,
        );
    };

    test('se construye correctamente con los datos requeridos', () => {
        const resenia = crearResenia();

        expect(resenia.comprador).toBe('comprador-id');
        expect(resenia.evento).toBe('evento-id');
        expect(resenia.detalle).toBe('Excelente evento');
        expect(resenia.puntuacion).toBe(5);
    });

    test('rechaza comprador o evento ausentes y detalle vacío', () => {
        expect(() => crearResenia({ comprador: undefined })).toThrow(DomainValidationError);
        expect(() => crearResenia({ evento: undefined })).toThrow(DomainValidationError);
        expect(() => crearResenia({ detalle: '   ' })).toThrow(DomainValidationError);
        expect(() => crearResenia({ detalle: 123 })).toThrow(DomainValidationError);
    });

    test('acepta puntuación cero', () => {
        expect(crearResenia({ puntuacion: 0 }).puntuacion).toBe(0);
    });

    test('rechaza puntuaciones negativas o no finitas', () => {
        expect(() => crearResenia({ puntuacion: -1 })).toThrow(DomainValidationError);
        expect(() => crearResenia({ puntuacion: Number.NaN })).toThrow(DomainValidationError);
        expect(() => crearResenia({ puntuacion: Number.POSITIVE_INFINITY })).toThrow(DomainValidationError);
        expect(() => crearResenia({ puntuacion: '5' })).toThrow(DomainValidationError);
    });
});