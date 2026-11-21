import { describe, expect, jest, test } from '@jest/globals';
import UsuarioController from '../../../src/controllers/UsuarioController.js';

const mockResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
});

describe('UsuarioController', () => {
    test('getAll responde con 200 y la lista del servicio', async () => {
        const usuarios = [{ id: '1', nombre: 'Ana' }];
        const service = { getAll: jest.fn().mockResolvedValue(usuarios) };
        const controller = new UsuarioController(service);
        const response = mockResponse();
        const next = jest.fn();

        await controller.getAll({}, response, next);

        expect(service.getAll).toHaveBeenCalledTimes(1);
        expect(response.status).toHaveBeenCalledWith(200);
        expect(response.json).toHaveBeenCalledWith(usuarios);
        expect(next).not.toHaveBeenCalled();
    });

    test('create responde con 201 y delega el body al servicio', async () => {
        const body = { nombre: 'Ana', apellido: 'Pérez', favoritos: [] };
        const creado = { id: 'usuario-id', ...body };
        const service = { create: jest.fn().mockResolvedValue(creado) };
        const controller = new UsuarioController(service);
        const response = mockResponse();
        const next = jest.fn();

        await controller.create({ body }, response, next);

        expect(service.create).toHaveBeenCalledWith(body);
        expect(response.status).toHaveBeenCalledWith(201);
        expect(response.json).toHaveBeenCalledWith(creado);
        expect(next).not.toHaveBeenCalled();
    });

    test('update responde con 200 y delega el id y body al servicio', async () => {
        const id = 'usuario-id';
        const body = { nombre: 'Ana', apellido: 'Gómez' };
        const actualizado = { id, ...body };
        const service = { update: jest.fn().mockResolvedValue(actualizado) };
        const controller = new UsuarioController(service);
        const response = mockResponse();
        const next = jest.fn();

        await controller.update({ params: { id }, body }, response, next);

        expect(service.update).toHaveBeenCalledWith(id, body);
        expect(response.status).toHaveBeenCalledWith(200);
        expect(response.json).toHaveBeenCalledWith(actualizado);
        expect(next).not.toHaveBeenCalled();
    });

    test('path responde con 200 y delega el cambio parcial al servicio', async () => {
        const id = 'usuario-id';
        const body = { apellido: 'Gómez' };
        const actualizado = { id, nombre: 'Ana', ...body };
        const service = { path: jest.fn().mockResolvedValue(actualizado) };
        const controller = new UsuarioController(service);
        const response = mockResponse();
        const next = jest.fn();

        await controller.path({ params: { id }, body }, response, next);

        expect(service.path).toHaveBeenCalledWith(id, body);
        expect(response.status).toHaveBeenCalledWith(200);
        expect(response.json).toHaveBeenCalledWith(actualizado);
        expect(next).not.toHaveBeenCalled();
    });

    test('delete responde con 204 y delega el id al servicio', async () => {
        const id = 'usuario-id';
        const service = { delete: jest.fn().mockResolvedValue(undefined) };
        const controller = new UsuarioController(service);
        const response = mockResponse();
        const next = jest.fn();

        await controller.delete({ params: { id } }, response, next);

        expect(service.delete).toHaveBeenCalledWith(id);
        expect(response.status).toHaveBeenCalledWith(204);
        expect(response.send).toHaveBeenCalledTimes(1);
        expect(next).not.toHaveBeenCalled();
    });

    test('envía los errores del servicio a next', async () => {
        const error = new Error('falló el servicio');
        const service = { getAll: jest.fn().mockRejectedValue(error) };
        const controller = new UsuarioController(service);
        const response = mockResponse();
        const next = jest.fn();

        await controller.getAll({}, response, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(response.json).not.toHaveBeenCalled();
    });
});