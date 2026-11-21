import { randomBytes } from 'node:crypto';
import { describe, expect, test } from '@jest/globals';
import CompraRepository from '../../../src/repositories/CompraRepository.js';

describe('CompraRepository en memoria', () => {
    test('guarda en su array y filtra por comprador y evento', async () => {
        const compradorId = randomBytes(12).toString('hex');
        const eventoId = randomBytes(12).toString('hex');
        const repository = new CompraRepository();

        const guardada = await repository.save({
            comprador: compradorId,
            evento: eventoId,
            tipoEntrada: { nombre: 'General', precio: 150, cupo: 20 },
            cantidad: 2,
            total: 300,
            estado: 'pendiente',
            mensajes: [],
        });

        expect(guardada.id).toMatch(/^[0-9a-f]{24}$/);
        expect(guardada._id).toBe(guardada.id);
        expect(JSON.parse(JSON.stringify(guardada))).not.toHaveProperty('_id');
        expect(repository.findByComprador(compradorId)).toHaveLength(1);
        expect(repository.findByEvento(eventoId)).toHaveLength(1);
        expect(new CompraRepository().findById(guardada.id)).toBeUndefined();
    });

    test('actualiza y elimina registros por su id', async () => {
        const repository = new CompraRepository();
        const guardada = await repository.save({
            comprador: randomBytes(12).toString('hex'),
            evento: randomBytes(12).toString('hex'),
            tipoEntrada: { nombre: 'Platea', precio: 300, cupo: 10 },
            cantidad: 1,
            total: 300,
            estado: 'pendiente',
            mensajes: [],
        });

        const actualizada = await repository.save({
            ...guardada,
            cantidad: 3,
            total: 900,
        });
        expect(actualizada.id).toBe(guardada.id);
        expect(actualizada.cantidad).toBe(3);

        await repository.deleteById(guardada.id);
        expect(repository.findById(guardada.id)).toBeUndefined();
    });
});
