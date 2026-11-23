import { describe, expect, test } from '@jest/globals';
import { eventoSchema, eventoUpdateSchema } from '../../../src/validations/evento.js';

describe('validación de evento', () => {
    const datosEvento = {
        nombre: 'Concierto',
        descripcion: 'Música en vivo',
        categoria: '0123456789abcdef01234567',
        fecha: '2027-01-01T20:00:00.000Z',
        organizador: '89abcdef0123456701234567',
        tiposEntrada: [{
            id: 'fedcba987654321001234567',
            nombre: 'General',
            descripcion: 'Acceso general',
            precio: 1000,
            cupo: 50,
        }],
    };

    test('permite conservar los IDs de entradas al actualizar un evento', () => {
        expect(eventoUpdateSchema.safeParse(datosEvento).success).toBe(true);
    });

    test('no permite enviar IDs de entradas al crear un evento', () => {
        expect(eventoSchema.safeParse(datosEvento).success).toBe(false);
    });
});
