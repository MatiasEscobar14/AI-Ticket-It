import { describe, expect, test } from '@jest/globals';
import TipoEntrada from '../../../src/domain/TipoEntrada.js';
import { DomainValidationError } from '../../../src/domain/Errors/DomainError.js';

describe('TipoEntrada', () => {
    const crearTipoEntrada = (datos = {}) => {
        const valores = {
            nombre: 'General',
            descripcion: 'Entrada general',
            precio: 100,
            cupo: 20,
            ...datos,
        };
        return new TipoEntrada(
            valores.nombre,
            valores.descripcion,
            valores.precio,
            valores.cupo,
        );
    };

    test('se construye correctamente con los datos requeridos', () => {
        const tipoEntrada = crearTipoEntrada();

        expect(tipoEntrada.nombre).toBe('General');
        expect(tipoEntrada.descripcion).toBe('Entrada general');
        expect(tipoEntrada.precio).toBe(100);
        expect(tipoEntrada.cupo).toBe(20);
    });

    test('rechaza nombres y descripciones ausentes, vacíos o de tipo incorrecto', () => {
        expect(() => crearTipoEntrada({ nombre: undefined })).toThrow(DomainValidationError);
        expect(() => crearTipoEntrada({ nombre: '   ' })).toThrow(DomainValidationError);
        expect(() => crearTipoEntrada({ nombre: 12 })).toThrow(DomainValidationError);
        expect(() => crearTipoEntrada({ descripcion: undefined })).toThrow(DomainValidationError);
        expect(() => crearTipoEntrada({ descripcion: '   ' })).toThrow(DomainValidationError);
        expect(() => crearTipoEntrada({ descripcion: 12 })).toThrow(DomainValidationError);
    });

    test('rechaza precios negativos o que no sean números finitos', () => {
        expect(() => crearTipoEntrada({ precio: -1 })).toThrow(DomainValidationError);
        expect(() => crearTipoEntrada({ precio: Number.NaN })).toThrow(DomainValidationError);
        expect(() => crearTipoEntrada({ precio: Number.POSITIVE_INFINITY })).toThrow(DomainValidationError);
        expect(() => crearTipoEntrada({ precio: '100' })).toThrow(DomainValidationError);
    });

    test('rechaza cupos negativos o que no sean enteros', () => {
        expect(() => crearTipoEntrada({ cupo: -1 })).toThrow(DomainValidationError);
        expect(() => crearTipoEntrada({ cupo: 1.5 })).toThrow(DomainValidationError);
        expect(() => crearTipoEntrada({ cupo: '20' })).toThrow(DomainValidationError);
    });

    test('hayCupoPara responde si alcanza el cupo solicitado', () => {
        const tipoEntrada = crearTipoEntrada({ cupo: 5 });

        expect(tipoEntrada.hayCupoPara(5)).toBe(true);
        expect(tipoEntrada.hayCupoPara(6)).toBe(false);
    });

    test('hayCupoPara rechaza cantidades que no sean enteros positivos', () => {
        const tipoEntrada = crearTipoEntrada();

        expect(() => tipoEntrada.hayCupoPara(0)).toThrow(DomainValidationError);
        expect(() => tipoEntrada.hayCupoPara(-1)).toThrow(DomainValidationError);
        expect(() => tipoEntrada.hayCupoPara(1.5)).toThrow(DomainValidationError);
    });
});