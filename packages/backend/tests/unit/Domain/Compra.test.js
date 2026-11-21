import { describe, expect, test } from '@jest/globals';
import Compra from '../../../src/domain/Compra.js';
import { EstadoCompra } from '../../../src/domain/EstadoCompra.js';
import { DomainValidationError } from '../../../src/domain/Errors/DomainError.js';

describe('Compra', () => {
    const crearCompra = (datos = {}) => {
        const valores = {
            comprador: 'comprador-id',
            evento: 'evento-id',
            tipoEntrada: { _id: 'tipo-id' },
            cantidad: 2,
            total: 300,
            estado: EstadoCompra.PENDIENTE,
            ...datos,
        };
        return new Compra(
            valores.comprador,
            valores.evento,
            valores.tipoEntrada,
            valores.cantidad,
            valores.total,
            valores.estado,
        );
    };

    test('se construye correctamente con los datos requeridos', () => {
        const compra = crearCompra();

        expect(compra.comprador).toBe('comprador-id');
        expect(compra.evento).toBe('evento-id');
        expect(compra.tipoEntrada).toEqual({ _id: 'tipo-id' });
        expect(compra.cantidad).toBe(2);
        expect(compra.total).toBe(300);
        expect(compra.estado).toBe(EstadoCompra.PENDIENTE);
        expect(compra.mensajes).toEqual([]);
    });

    test('rechaza la falta de comprador, evento o tipo de entrada', () => {
        expect(() => crearCompra({ comprador: undefined })).toThrow(DomainValidationError);
        expect(() => crearCompra({ evento: undefined })).toThrow(DomainValidationError);
        expect(() => crearCompra({ tipoEntrada: undefined })).toThrow(DomainValidationError);
    });

    test('rechaza cantidades que no sean enteros positivos', () => {
        expect(() => crearCompra({ cantidad: 0 })).toThrow(DomainValidationError);
        expect(() => crearCompra({ cantidad: -1 })).toThrow(DomainValidationError);
        expect(() => crearCompra({ cantidad: 1.5 })).toThrow(DomainValidationError);
    });

    test('rechaza totales negativos o que no sean números finitos', () => {
        expect(() => crearCompra({ total: -1 })).toThrow(DomainValidationError);
        expect(() => crearCompra({ total: '300' })).toThrow(DomainValidationError);
        expect(() => crearCompra({ total: Number.NaN })).toThrow(DomainValidationError);
        expect(() => crearCompra({ total: Number.POSITIVE_INFINITY })).toThrow(DomainValidationError);
    });

    test('rechaza estados que no pertenecen a los estados válidos', () => {
        expect(() => crearCompra({ estado: 'desconocido' })).toThrow(DomainValidationError);
    });

    test('agregarMensaje añade un mensaje a la compra', () => {
        const compra = crearCompra();
        const mensaje = { usuario: 'usuario-id', mensaje: 'Hola' };

        compra.agregarMensaje(mensaje);

        expect(compra.mensajes).toEqual([mensaje]);
    });

    test('actualizarEstado cambia el estado de la compra', () => {
        const compra = crearCompra();

        compra.actualizarEstado(EstadoCompra.CONFIRMADA);

        expect(compra.estado).toBe(EstadoCompra.CONFIRMADA);
    });

    test('actualizarEstado rechaza un estado inválido sin modificar la compra', () => {
        const compra = crearCompra();

        expect(() => compra.actualizarEstado('desconocido')).toThrow(DomainValidationError);
        expect(compra.estado).toBe(EstadoCompra.PENDIENTE);
    });
});