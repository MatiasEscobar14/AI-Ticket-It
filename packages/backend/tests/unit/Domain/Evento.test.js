import { describe, expect, test } from '@jest/globals';
import Evento from '../../../src/domain/Evento.js';
import { DomainValidationError } from '../../../src/domain/Errors/DomainError.js';

describe('Evento', () => {
    const crearEvento = (datos = {}) => {
        const valores = {
            nombre: 'Concierto',
            descripcion: 'Música en vivo',
            categoria: 'categoria-id',
            fecha: new Date('2027-01-01T20:00:00.000Z'),
            multimedia: [],
            organizador: 'organizador-id',
            tiposEntrada: [],
            ...datos,
        };
        return new Evento(
            valores.nombre,
            valores.descripcion,
            valores.categoria,
            valores.fecha,
            valores.multimedia,
            valores.organizador,
            valores.tiposEntrada,
        );
    };

    test('se construye correctamente con los datos requeridos y valores opcionales', () => {
        const evento = crearEvento();

        expect(evento.nombre).toBe('Concierto');
        expect(evento.descripcion).toBe('Música en vivo');
        expect(evento.categoria).toBe('categoria-id');
        expect(evento.fecha).toEqual(new Date('2027-01-01T20:00:00.000Z'));
        expect(evento.organizador).toBe('organizador-id');
        expect(evento.multimedia).toEqual([]);
        expect(evento.tiposEntrada).toEqual([]);
    });

    test('rechaza un nombre ausente, vacío o de tipo incorrecto', () => {
        expect(() => crearEvento({ nombre: undefined })).toThrow(DomainValidationError);
        expect(() => crearEvento({ nombre: '   ' })).toThrow(DomainValidationError);
        expect(() => crearEvento({ nombre: 12 })).toThrow(DomainValidationError);
    });

    test('rechaza una descripción, categoría u organizador ausentes', () => {
        expect(() => crearEvento({ descripcion: '   ' })).toThrow(DomainValidationError);
        expect(() => crearEvento({ categoria: undefined })).toThrow(DomainValidationError);
        expect(() => crearEvento({ organizador: undefined })).toThrow(DomainValidationError);
    });

    test('rechaza fechas ausentes o inválidas', () => {
        expect(() => crearEvento({ fecha: undefined })).toThrow(DomainValidationError);
        expect(() => crearEvento({ fecha: new Date('fecha inválida') })).toThrow(DomainValidationError);
        expect(() => crearEvento({ fecha: '2027-01-01' })).toThrow(DomainValidationError);
    });

    test('agregarTipoEntrada evita duplicados y acepta objetos o IDs', () => {
        const entrada = { _id: 'tipo-id', nombre: 'General', precio: 100 };
        const evento = crearEvento({ tiposEntrada: [entrada] });

        evento.agregarTipoEntrada({ _id: 'tipo-id', nombre: 'Duplicada' });
        evento.agregarTipoEntrada('otro-tipo-id');

        expect(evento.tiposEntrada).toEqual([entrada, 'otro-tipo-id']);
    });

    test('quitarTipoEntrada elimina la entrada identificada por ID u objeto', () => {
        const entrada = { _id: 'tipo-id', nombre: 'General' };
        const evento = crearEvento({ tiposEntrada: [entrada, 'otro-tipo-id'] });

        evento.quitarTipoEntrada({ _id: 'tipo-id' });

        expect(evento.tiposEntrada).toEqual(['otro-tipo-id']);
    });

    test('tuPrecioEstaEntre contempla los límites del rango', () => {
        const evento = crearEvento({
            tiposEntrada: [{ precio: 100 }, { precio: 250 }],
        });

        expect(evento.tuPrecioEstaEntre(100, 100)).toBe(true);
        expect(evento.tuPrecioEstaEntre(150, 200)).toBe(false);
    });

    test('tuPrecioEstaEntre rechaza rangos inválidos', () => {
        const evento = crearEvento();

        expect(() => evento.tuPrecioEstaEntre(20, 10)).toThrow(DomainValidationError);
        expect(() => evento.tuPrecioEstaEntre(Number.NaN, 10)).toThrow(DomainValidationError);
        expect(() => evento.tuPrecioEstaEntre(0, Number.POSITIVE_INFINITY)).toThrow(DomainValidationError);
    });
});