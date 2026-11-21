import { describe, expect, jest, test } from '@jest/globals';
import CompraController from '../../../src/controllers/CompraController.js';

const mockResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
});

describe('CompraController', () => {
    test('getAll responde con 200 y la lista del servicio', async () => {
        const compras = [{ id: '1', estado: 'pendiente' }];
        const service = { getAll: jest.fn().mockResolvedValue(compras) };
        const controller = new CompraController(service);
        const response = mockResponse();
        const next = jest.fn();

        await controller.getAll({}, response, next);

        expect(service.getAll).toHaveBeenCalledTimes(1);
        expect(response.status).toHaveBeenCalledWith(200);
        expect(response.json).toHaveBeenCalledWith(compras);
        expect(next).not.toHaveBeenCalled();
    });

    test('getByComprador responde con 200 y delega el ID del comprador al servicio', async () => {
        const compradorId = 'comprador-id';
        const compras = [{ id: 'compra-id', comprador: compradorId, estado: 'confirmada' }];
        const service = { getByComprador: jest.fn().mockResolvedValue(compras) };
        const controller = new CompraController(service);
        const response = mockResponse();
        const next = jest.fn();

        await controller.getByComprador({ params: { id: compradorId } }, response, next);

        expect(service.getByComprador).toHaveBeenCalledWith(compradorId);
        expect(response.status).toHaveBeenCalledWith(200);
        expect(response.json).toHaveBeenCalledWith(compras);
        expect(next).not.toHaveBeenCalled();
    });

    test('create responde con 201 y delega el body al servicio', async () => {
        const body = { comprador: 'usuario-id', evento: 'evento-id', cantidad: 2 };
        const creada = { id: 'compra-id', ...body };
        const service = { create: jest.fn().mockResolvedValue(creada) };
        const controller = new CompraController(service);
        const response = mockResponse();
        const next = jest.fn();

        await controller.create({ body }, response, next);

        expect(service.create).toHaveBeenCalledWith(body);
        expect(response.status).toHaveBeenCalledWith(201);
        expect(response.json).toHaveBeenCalledWith(creada);
        expect(next).not.toHaveBeenCalled();
    });

    test('update responde con 200 y delega el id y body al servicio', async () => {
        const id = 'compra-id';
        const body = { estado: 'confirmada' };
        const actualizada = { id, ...body };
        const service = { update: jest.fn().mockResolvedValue(actualizada) };
        const controller = new CompraController(service);
        const response = mockResponse();
        const next = jest.fn();

        await controller.update({ params: { id }, body }, response, next);

        expect(service.update).toHaveBeenCalledWith(id, body);
        expect(response.status).toHaveBeenCalledWith(200);
        expect(response.json).toHaveBeenCalledWith(actualizada);
        expect(next).not.toHaveBeenCalled();
    });

    test('path responde con 200 y delega el cambio parcial al servicio', async () => {
        const id = 'compra-id';
        const body = { estado: 'confirmada' };
        const actualizada = { id, ...body };
        const service = { path: jest.fn().mockResolvedValue(actualizada) };
        const controller = new CompraController(service);
        const response = mockResponse();
        const next = jest.fn();

        await controller.path({ params: { id }, body }, response, next);

        expect(service.path).toHaveBeenCalledWith(id, body);
        expect(response.status).toHaveBeenCalledWith(200);
        expect(response.json).toHaveBeenCalledWith(actualizada);
        expect(next).not.toHaveBeenCalled();
    });

    test('delete responde con 204 y delega el id al servicio', async () => {
        const id = 'compra-id';
        const service = { delete: jest.fn().mockResolvedValue(undefined) };
        const controller = new CompraController(service);
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
        const service = {
            getAll: jest.fn().mockRejectedValue(error),
            getByComprador: jest.fn().mockRejectedValue(error),
        };
        const controller = new CompraController(service);
        const response = mockResponse();
        const next = jest.fn();

        await controller.getAll({}, response, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(response.json).not.toHaveBeenCalled();

        next.mockClear();
        await controller.getByComprador({ params: { id: 'comprador-id' } }, response, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(response.json).not.toHaveBeenCalled();
    });
});