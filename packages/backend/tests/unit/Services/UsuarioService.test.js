import { describe, expect, jest, test } from '@jest/globals';
import UsuarioService from '../../../src/services/UsuarioService.js';

describe('UsuarioService', () => {
    test('devuelve todos los usuarios del repositorio', async () => {
        const usuarios = [{ _id: 'usuario-id', nombre: 'Ana' }];
        const repository = { getAll: jest.fn().mockResolvedValue(usuarios) };
        const service = new UsuarioService(repository);

        await expect(service.getAll()).resolves.toBe(usuarios);
        expect(repository.getAll).toHaveBeenCalledTimes(1);
    });

    test('crea un usuario con favoritos vacíos cuando no se especifican', async () => {
        const datos = { nombre: 'Ana', apellido: 'Pérez' };
        const repository = { save: jest.fn(async (usuario) => usuario) };
        const service = new UsuarioService(repository);

        const creado = await service.create(datos);

        expect(creado).toMatchObject({ ...datos, favoritos: [] });
        expect(repository.save).toHaveBeenCalledTimes(1);
    });

    test('crea un usuario con los favoritos recibidos', async () => {
        const datos = { nombre: 'Ana', apellido: 'Pérez', favoritos: ['evento-id'] };
        const repository = { save: jest.fn(async (usuario) => usuario) };
        const service = new UsuarioService(repository);

        const creado = await service.create(datos);

        expect(creado).toMatchObject(datos);
    });

    test('actualiza un usuario existente conservando sus datos no modificados', async () => {
        const existente = {
            _id: 'usuario-id',
            nombre: 'Ana',
            apellido: 'Pérez',
            favoritos: ['evento-id'],
        };
        const repository = {
            findById: jest.fn().mockResolvedValue(existente),
            save: jest.fn(async (usuario) => usuario),
        };
        const service = new UsuarioService(repository);

        const actualizado = await service.update('usuario-id', { apellido: 'Gómez' });

        expect(actualizado).toMatchObject({
            _id: 'usuario-id',
            nombre: 'Ana',
            apellido: 'Gómez',
            favoritos: ['evento-id'],
        });
    });

    test('path actualiza parcialmente al usuario', async () => {
        const existente = { _id: 'usuario-id', nombre: 'Ana', apellido: 'Pérez', favoritos: [] };
        const repository = {
            findById: jest.fn().mockResolvedValue(existente),
            save: jest.fn(async (usuario) => usuario),
        };
        const service = new UsuarioService(repository);

        const actualizado = await service.path('usuario-id', { nombre: 'Lucía' });

        expect(actualizado).toMatchObject({ _id: 'usuario-id', nombre: 'Lucía', apellido: 'Pérez' });
    });

    test('rechaza actualizar o borrar un usuario inexistente', async () => {
        const repository = {
            findById: jest.fn().mockResolvedValue(null),
            save: jest.fn(),
            deleteById: jest.fn(),
        };
        const service = new UsuarioService(repository);

        await expect(service.update('missing-id', { nombre: 'Ana', apellido: 'Pérez' }))
            .rejects.toMatchObject({ message: 'El usuario con id missing-id no existe', statusCode: 404 });
        await expect(service.delete('missing-id'))
            .rejects.toMatchObject({ message: 'El usuario con id missing-id no existe', statusCode: 404 });
        expect(repository.save).not.toHaveBeenCalled();
        expect(repository.deleteById).not.toHaveBeenCalled();
    });

    test('borra un usuario existente', async () => {
        const repository = {
            findById: jest.fn().mockResolvedValue({ _id: 'usuario-id' }),
            deleteById: jest.fn().mockResolvedValue(undefined),
        };
        const service = new UsuarioService(repository);

        await service.delete('usuario-id');

        expect(repository.deleteById).toHaveBeenCalledWith('usuario-id');
    });
});
