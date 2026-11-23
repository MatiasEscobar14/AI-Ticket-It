import { describe, expect, jest, test } from '@jest/globals';
import EventoService from '../../../src/services/EventoService.js';

describe('EventoService', () => {
    const datosEvento = {
        nombre: 'Concierto',
        descripcion: 'Música en vivo',
        categoria: 'categoria-id',
        fecha: '2027-01-01T20:00:00.000Z',
        multimedia: ['imagen.jpg'],
        organizador: 'organizador-id',
        tiposEntrada: [{ _id: 'tipo-id', nombre: 'General' }],
    };

    test('devuelve todos los eventos del repositorio', async () => {
        const eventos = [{ _id: 'evento-id', nombre: 'Concierto' }];
        const repository = { getAll: jest.fn().mockResolvedValue(eventos) };
        const service = new EventoService(repository, { findByEvento: jest.fn() });

        await expect(service.getAll()).resolves.toBe(eventos);
        expect(repository.getAll).toHaveBeenCalledTimes(1);
    });

    test('crea un evento y convierte la fecha a Date', async () => {
        const repository = { save: jest.fn(async (evento) => evento) };
        const service = new EventoService(repository, { findByEvento: jest.fn() });

        const creado = await service.create(datosEvento);

        expect(creado).toMatchObject({
            ...datosEvento,
            fecha: new Date(datosEvento.fecha),
        });
        expect(creado.fecha).toBeInstanceOf(Date);
    });

    test('actualiza un evento preservando IDs de entradas embebidas', async () => {
        const existente = {
            _id: 'evento-id',
            ...datosEvento,
            fecha: new Date(datosEvento.fecha),
            toObject() {
                return {
                    _id: this._id,
                    nombre: this.nombre,
                    descripcion: this.descripcion,
                    categoria: this.categoria,
                    fecha: this.fecha,
                    multimedia: this.multimedia,
                    organizador: this.organizador,
                    tiposEntrada: this.tiposEntrada,
                };
            },
        };
        const repository = {
            findById: jest.fn().mockResolvedValue(existente),
            save: jest.fn(async (evento) => evento),
        };
        const service = new EventoService(repository, { findByEvento: jest.fn().mockResolvedValue([]) });

        const actualizado = await service.update('evento-id', { nombre: 'Concierto nuevo' });

        expect(actualizado._id).toBe('evento-id');
        expect(actualizado.nombre).toBe('Concierto nuevo');
        expect(actualizado.tiposEntrada).toEqual(datosEvento.tiposEntrada);
    });

    test('path actualiza parcialmente un evento', async () => {
        const existente = {
            _id: 'evento-id',
            ...datosEvento,
            fecha: new Date(datosEvento.fecha),
        };
        const repository = {
            findById: jest.fn().mockResolvedValue(existente),
            save: jest.fn(async (evento) => evento),
        };
        const service = new EventoService(repository, { findByEvento: jest.fn() });

        const actualizado = await service.path('evento-id', { descripcion: 'Nueva descripción' });

        expect(actualizado).toMatchObject({
            _id: 'evento-id',
            nombre: 'Concierto',
            descripcion: 'Nueva descripción',
        });
    });

    test('rechaza actualizar o borrar un evento inexistente', async () => {
        const repository = {
            findById: jest.fn().mockResolvedValue(null),
            save: jest.fn(),
            deleteById: jest.fn(),
        };
        const service = new EventoService(repository, { findByEvento: jest.fn() });

        await expect(service.update('missing-id', datosEvento))
            .rejects.toMatchObject({ message: 'El evento con id missing-id no existe', statusCode: 404 });
        await expect(service.delete('missing-id'))
            .rejects.toMatchObject({ message: 'El evento con id missing-id no existe', statusCode: 404 });
        expect(repository.save).not.toHaveBeenCalled();
        expect(repository.deleteById).not.toHaveBeenCalled();
    });

    test('borra un evento existente', async () => {
        const repository = {
            findById: jest.fn().mockResolvedValue({ _id: 'evento-id' }),
            deleteById: jest.fn().mockResolvedValue(undefined),
        };
        const purchases = { findByEvento: jest.fn().mockResolvedValue([]) };
        const service = new EventoService(repository, purchases);

        await service.delete('evento-id');

        expect(purchases.findByEvento).toHaveBeenCalledWith('evento-id');
        expect(repository.deleteById).toHaveBeenCalledWith('evento-id');
    });

    test('rejects deleting an event with associated purchases', async () => {
        const repository = {
            findById: jest.fn().mockResolvedValue({ _id: 'evento-id' }),
            deleteById: jest.fn(),
        };
        const purchases = {
            findByEvento: jest.fn().mockResolvedValue([{ _id: 'compra-id' }]),
        };
        const service = new EventoService(repository, purchases);

        await expect(service.delete('evento-id'))
            .rejects.toMatchObject({
                message: 'No se puede eliminar un evento con compras asociadas',
                statusCode: 409,
            });
        expect(repository.deleteById).not.toHaveBeenCalled();
    });

    test('rejects removing a ticket type with associated purchases', async () => {
        const existente = {
            _id: 'evento-id',
            ...datosEvento,
            fecha: new Date(datosEvento.fecha),
            tiposEntrada: [{ id: 'tipo-id', nombre: 'General' }],
        };
        const repository = {
            findById: jest.fn().mockResolvedValue(existente),
            save: jest.fn(),
        };
        const purchases = {
            findByEvento: jest.fn().mockResolvedValue([
                { tipoEntrada: { id: 'tipo-id' } },
            ]),
        };
        const service = new EventoService(repository, purchases);

        await expect(service.update('evento-id', { tiposEntrada: [] }))
            .rejects.toMatchObject({
                message: 'No se puede quitar un tipo de entrada que tiene compras asociadas',
                statusCode: 409,
            });
        expect(repository.save).not.toHaveBeenCalled();
    });
});
