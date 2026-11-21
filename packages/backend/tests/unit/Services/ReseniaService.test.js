import { describe, expect, jest, test } from '@jest/globals';
import ReseniaService from '../../../src/services/ReseniaService.js';

describe('ReseniaService', () => {
    test('devuelve todas las reseñas del repositorio', async () => {
        const resenias = [{ _id: 'resenia-id', detalle: 'Muy bueno' }];
        const repository = { getAll: jest.fn().mockResolvedValue(resenias) };
        const service = new ReseniaService(repository);

        await expect(service.getAll()).resolves.toBe(resenias);
        expect(repository.getAll).toHaveBeenCalledTimes(1);
    });

    test('crea y guarda una reseña', async () => {
        const datos = {
            comprador: 'comprador-id',
            evento: 'evento-id',
            detalle: 'Excelente',
            puntuacion: 5,
        };
        const repository = { save: jest.fn(async (resenia) => resenia) };
        const service = new ReseniaService(repository);

        const creada = await service.create(datos);

        expect(creada).toMatchObject(datos);
        expect(repository.save).toHaveBeenCalledTimes(1);
    });

    test('actualiza una reseña existente conservando su ID', async () => {
        const existente = {
            _id: 'resenia-id',
            comprador: 'comprador-id',
            evento: 'evento-id',
            detalle: 'Buena',
            puntuacion: 4,
        };
        const repository = {
            findById: jest.fn().mockResolvedValue(existente),
            save: jest.fn(async (resenia) => resenia),
        };
        const service = new ReseniaService(repository);

        const actualizada = await service.update('resenia-id', { detalle: 'Excelente', puntuacion: 5 });

        expect(actualizada).toMatchObject({
            _id: 'resenia-id',
            comprador: 'comprador-id',
            evento: 'evento-id',
            detalle: 'Excelente',
            puntuacion: 5,
        });
    });

    test('path aplica una actualización parcial', async () => {
        const existente = {
            _id: 'resenia-id',
            comprador: 'comprador-id',
            evento: 'evento-id',
            detalle: 'Buena',
            puntuacion: 4,
        };
        const repository = {
            findById: jest.fn().mockResolvedValue(existente),
            save: jest.fn(async (resenia) => resenia),
        };
        const service = new ReseniaService(repository);

        const actualizada = await service.path('resenia-id', { puntuacion: 5 });

        expect(actualizada).toMatchObject({ _id: 'resenia-id', detalle: 'Buena', puntuacion: 5 });
    });

    test('rechaza actualizar o borrar una reseña inexistente', async () => {
        const repository = {
            findById: jest.fn().mockResolvedValue(null),
            save: jest.fn(),
            deleteById: jest.fn(),
        };
        const service = new ReseniaService(repository);

        await expect(service.update('missing-id', {
            comprador: 'comprador-id',
            evento: 'evento-id',
            detalle: 'Test',
            puntuacion: 5,
        })).rejects.toMatchObject({ message: 'La reseña con id missing-id no existe', statusCode: 404 });
        await expect(service.delete('missing-id'))
            .rejects.toMatchObject({ message: 'La reseña con id missing-id no existe', statusCode: 404 });
        expect(repository.save).not.toHaveBeenCalled();
        expect(repository.deleteById).not.toHaveBeenCalled();
    });

    test('borra una reseña existente', async () => {
        const repository = {
            findById: jest.fn().mockResolvedValue({ _id: 'resenia-id' }),
            deleteById: jest.fn().mockResolvedValue(undefined),
        };
        const service = new ReseniaService(repository);

        await service.delete('resenia-id');

        expect(repository.deleteById).toHaveBeenCalledWith('resenia-id');
    });
});
