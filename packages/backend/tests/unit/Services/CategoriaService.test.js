import { describe, expect, jest, test } from '@jest/globals';
import CategoriaService from '../../../src/services/CategoriaService.js';

describe('CategoriaService', () => {
    test('devuelve todas las categorías del repositorio', async () => {
        const categorias = [{ _id: 'categoria-id', nombre: 'Música' }];
        const repository = { getAll: jest.fn().mockResolvedValue(categorias) };
        const service = new CategoriaService(repository);

        await expect(service.getAll()).resolves.toBe(categorias);
        expect(repository.getAll).toHaveBeenCalledTimes(1);
    });

    test('crea y guarda una categoría', async () => {
        const datos = { nombre: 'Música', descripcion: 'Conciertos en vivo' };
        const repository = { save: jest.fn(async (categoria) => categoria) };
        const service = new CategoriaService(repository);

        const creada = await service.create(datos);

        expect(creada).toMatchObject(datos);
        expect(repository.save).toHaveBeenCalledTimes(1);
    });

    test('actualiza una categoría existente conservando su ID', async () => {
        const existente = { _id: 'categoria-id', nombre: 'Música', descripcion: 'Conciertos' };
        const repository = {
            findById: jest.fn().mockResolvedValue(existente),
            save: jest.fn(async (categoria) => categoria),
        };
        const service = new CategoriaService(repository);

        const actualizada = await service.update('categoria-id', { descripcion: 'Festivales' });

        expect(repository.findById).toHaveBeenCalledWith('categoria-id');
        expect(actualizada).toMatchObject({
            _id: 'categoria-id',
            nombre: 'Música',
            descripcion: 'Festivales',
        });
    });

    test('path actualiza parcialmente la categoría', async () => {
        const existente = { _id: 'categoria-id', nombre: 'Música', descripcion: 'Conciertos' };
        const repository = {
            findById: jest.fn().mockResolvedValue(existente),
            save: jest.fn(async (categoria) => categoria),
        };
        const service = new CategoriaService(repository);

        const actualizada = await service.path('categoria-id', { nombre: 'Teatro' });

        expect(actualizada).toMatchObject({ _id: 'categoria-id', nombre: 'Teatro', descripcion: 'Conciertos' });
    });

    test('rechaza actualizar o borrar una categoría inexistente', async () => {
        const repository = {
            findById: jest.fn().mockResolvedValue(null),
            save: jest.fn(),
            deleteById: jest.fn(),
        };
        const service = new CategoriaService(repository);

        await expect(service.update('missing-id', { nombre: 'Nueva', descripcion: 'Descripción' }))
            .rejects.toMatchObject({ message: 'La categoría con id missing-id no existe', statusCode: 404 });
        await expect(service.delete('missing-id'))
            .rejects.toMatchObject({ message: 'La categoría con id missing-id no existe', statusCode: 404 });
        expect(repository.save).not.toHaveBeenCalled();
        expect(repository.deleteById).not.toHaveBeenCalled();
    });

    test('borra una categoría existente', async () => {
        const repository = {
            findById: jest.fn().mockResolvedValue({ _id: 'categoria-id' }),
            deleteById: jest.fn().mockResolvedValue(undefined),
        };
        const service = new CategoriaService(repository);

        await service.delete('categoria-id');

        expect(repository.deleteById).toHaveBeenCalledWith('categoria-id');
    });
});
