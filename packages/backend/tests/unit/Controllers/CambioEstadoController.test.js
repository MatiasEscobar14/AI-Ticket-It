import { describe, expect, jest, test } from '@jest/globals';
import CambioEstadoCompraController from '../../../src/controllers/CambioEstadoCompraController.js';

const mockResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
});

describe('CambioEstadoCompraController', () => {
    test('getAll responde con 200 y la lista del servicio', async () => {
        const cambios = [{ id: '1', estado: 'pendiente' }];
        const service = { getAll: jest.fn().mockResolvedValue(cambios) };
        const controller = new CambioEstadoCompraController(service);
        const response = mockResponse();
        const next = jest.fn();

        await controller.getAll({}, response, next);

        expect(service.getAll).toHaveBeenCalledTimes(1);
        expect(response.status).toHaveBeenCalledWith(200);
        expect(response.json).toHaveBeenCalledWith(cambios);
        expect(next).not.toHaveBeenCalled();
    });

    test('create responde con 201 y delega el body al servicio', async () => {
        const body = { compra: 'compra-id', estado: 'pendiente', quien: 'usuario-id' };
        const creado = { id: 'cambio-id', ...body };
        const service = { create: jest.fn().mockResolvedValue(creado) };
        const controller = new CambioEstadoCompraController(service);
        const response = mockResponse();
        const next = jest.fn();

        await controller.create({ body }, response, next);

        expect(service.create).toHaveBeenCalledWith(body);
        expect(response.status).toHaveBeenCalledWith(201);
        expect(response.json).toHaveBeenCalledWith(creado);
        expect(next).not.toHaveBeenCalled();
    });

    test('update responde con 200 y delega el id y body al servicio', async () => {
        const id = 'cambio-id';
        const body = { compra: 'compra-id', estado: 'confirmada', quien: 'usuario-id' };
        const actualizado = { id, ...body };
        const service = { update: jest.fn().mockResolvedValue(actualizado) };
        const controller = new CambioEstadoCompraController(service);
        const response = mockResponse();
        const next = jest.fn();

        await controller.update({ params: { id }, body }, response, next);

        expect(service.update).toHaveBeenCalledWith(id, body);
        expect(response.status).toHaveBeenCalledWith(200);
        expect(response.json).toHaveBeenCalledWith(actualizado);
        expect(next).not.toHaveBeenCalled();
    });

    test('path responde con 200 y delega el cambio parcial al servicio', async () => {
        const id = 'cambio-id';
        const body = { estado: 'confirmada' };
        const actualizado = { id, ...body };
        const service = { path: jest.fn().mockResolvedValue(actualizado) };
        const controller = new CambioEstadoCompraController(service);
        const response = mockResponse();
        const next = jest.fn();

        await controller.path({ params: { id }, body }, response, next);

        expect(service.path).toHaveBeenCalledWith(id, body);
        expect(response.status).toHaveBeenCalledWith(200);
        expect(response.json).toHaveBeenCalledWith(actualizado);
        expect(next).not.toHaveBeenCalled();
    });

    test('delete responde con 204 y delega el id al servicio', async () => {
        const id = 'cambio-id';
        const service = { delete: jest.fn().mockResolvedValue(undefined) };
        const controller = new CambioEstadoCompraController(service);
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
        const controller = new CambioEstadoCompraController(service);
        const response = mockResponse();
        const next = jest.fn();

        await controller.getAll({}, response, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(response.json).not.toHaveBeenCalled();
    });
});
