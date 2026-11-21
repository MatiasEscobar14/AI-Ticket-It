import { describe, expect, jest, test } from '@jest/globals';
import MensajeService from '../../../src/services/MensajeService.js';

describe('MensajeService', () => {
    test('devuelve todos los mensajes del repositorio', async () => {
        const mensajes = [{ _id: 'mensaje-id', mensaje: 'Hola' }];
        const repository = { getAll: jest.fn().mockResolvedValue(mensajes) };
        const service = new MensajeService(repository);

        await expect(service.getAll()).resolves.toBe(mensajes);
        expect(repository.getAll).toHaveBeenCalledTimes(1);
    });

    test('crea un mensaje y normaliza la fecha de envío', async () => {
        const datos = { usuario: 'usuario-id', mensaje: 'Hola', enviado: '2026-01-02T03:04:05.000Z' };
        const repository = { save: jest.fn(async (mensaje) => mensaje) };
        const service = new MensajeService(repository);

        const creado = await service.create(datos);

        expect(creado).toMatchObject({ usuario: datos.usuario, mensaje: datos.mensaje });
        expect(creado.enviado).toBeInstanceOf(Date);
        expect(repository.save).toHaveBeenCalledTimes(1);
    });

    test('actualiza un mensaje existente conservando su ID', async () => {
        const existente = { _id: 'mensaje-id', usuario: 'usuario-id', mensaje: 'Hola' };
        const repository = {
            findById: jest.fn().mockResolvedValue(existente),
            save: jest.fn(async (mensaje) => mensaje),
        };
        const service = new MensajeService(repository);

        const actualizado = await service.update('mensaje-id', { mensaje: 'Chau' });

        expect(actualizado).toMatchObject({ _id: 'mensaje-id', usuario: 'usuario-id', mensaje: 'Chau' });
        expect(actualizado.enviado).toBeInstanceOf(Date);
    });

    test('path aplica una actualización parcial', async () => {
        const existente = { _id: 'mensaje-id', usuario: 'usuario-id', mensaje: 'Hola' };
        const repository = {
            findById: jest.fn().mockResolvedValue(existente),
            save: jest.fn(async (mensaje) => mensaje),
        };
        const service = new MensajeService(repository);

        const actualizado = await service.path('mensaje-id', { mensaje: 'Actualizado' });

        expect(actualizado).toMatchObject({ _id: 'mensaje-id', usuario: 'usuario-id', mensaje: 'Actualizado' });
    });

    test('rechaza actualizar o borrar un mensaje inexistente', async () => {
        const repository = {
            findById: jest.fn().mockResolvedValue(null),
            save: jest.fn(),
            deleteById: jest.fn(),
        };
        const service = new MensajeService(repository);

        await expect(service.update('missing-id', { usuario: 'usuario-id', mensaje: 'Hola' }))
            .rejects.toMatchObject({ message: 'El mensaje con id missing-id no existe', statusCode: 404 });
        await expect(service.delete('missing-id'))
            .rejects.toMatchObject({ message: 'El mensaje con id missing-id no existe', statusCode: 404 });
        expect(repository.save).not.toHaveBeenCalled();
        expect(repository.deleteById).not.toHaveBeenCalled();
    });

    test('borra un mensaje existente', async () => {
        const repository = {
            findById: jest.fn().mockResolvedValue({ _id: 'mensaje-id' }),
            deleteById: jest.fn().mockResolvedValue(undefined),
        };
        const service = new MensajeService(repository);

        await service.delete('mensaje-id');

        expect(repository.deleteById).toHaveBeenCalledWith('mensaje-id');
    });
});
