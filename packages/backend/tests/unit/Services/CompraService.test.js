import { describe, expect, jest, test } from '@jest/globals';
import CompraService from '../../../src/services/CompraService.js';

describe('CompraService', () => {
    const ticket = { _id: 'tipo-id', nombre: 'General', precio: 150, cupo: 20 };
    const datosCompra = {
        comprador: 'comprador-id',
        evento: 'evento-id',
        tipoEntrada: 'tipo-id',
        cantidad: 2,
        total: 300,
        estado: 'pendiente',
    };

    const crearService = ({ compra = null, evento = { tiposEntrada: [ticket] } } = {}) => {
        const CompraRepository = {
            getAll: jest.fn().mockResolvedValue([]),
            findByComprador: jest.fn().mockResolvedValue([]),
            findById: jest.fn().mockResolvedValue(compra),
            save: jest.fn(async (entity) => entity),
            deleteById: jest.fn().mockResolvedValue(undefined),
        };
        const EventoRepository = {
            findById: jest.fn().mockResolvedValue(evento),
            save: jest.fn(async (entity) => entity),
        };
        return { service: new CompraService(CompraRepository, EventoRepository), CompraRepository, EventoRepository };
    };

    test('devuelve todas las compras del repositorio', async () => {
        const { service, CompraRepository } = crearService();

        await expect(service.getAll()).resolves.toEqual([]);
        expect(CompraRepository.getAll).toHaveBeenCalledTimes(1);
    });

    test('devuelve las compras del comprador indicado', async () => {
        const compras = [{ _id: 'compra-id', comprador: 'comprador-id', estado: 'confirmada' }];
        const { service, CompraRepository } = crearService();
        CompraRepository.findByComprador.mockResolvedValue(compras);

        await expect(service.getByComprador('comprador-id')).resolves.toBe(compras);

        expect(CompraRepository.findByComprador).toHaveBeenCalledWith('comprador-id');
    });

    test('crea una compra con una copia del tipo de entrada perteneciente al evento', async () => {
        const { service, CompraRepository, EventoRepository } = crearService();

        const creada = await service.create(datosCompra);

        expect(EventoRepository.findById).toHaveBeenCalledWith('evento-id');
        expect(CompraRepository.save).toHaveBeenCalledTimes(1);
        expect(creada).toMatchObject({
            comprador: 'comprador-id',
            evento: 'evento-id',
            tipoEntrada: ticket,
            cantidad: 2,
            total: 300,
        });
    });

    test('acepta referencias de comprador y evento como objetos con ID', async () => {
        const { service, CompraRepository } = crearService();

        const creada = await service.create({
            ...datosCompra,
            comprador: { _id: 'comprador-id' },
            evento: { id: 'evento-id' },
            tipoEntrada: { _id: 'tipo-id' },
        });

        expect(creada.comprador).toBe('comprador-id');
        expect(creada.evento).toBe('evento-id');
        expect(CompraRepository.save).toHaveBeenCalledTimes(1);
    });

    test('rechaza la compra cuando el evento no existe', async () => {
        const { service, CompraRepository } = crearService({ evento: null });

        await expect(service.create(datosCompra))
            .rejects.toMatchObject({ message: 'El evento con id evento-id no existe', statusCode: 404 });
        expect(CompraRepository.save).not.toHaveBeenCalled();
    });

    test('rechaza una entrada que no pertenece al evento', async () => {
        const { service, CompraRepository } = crearService({ evento: { tiposEntrada: [] } });

        await expect(service.create(datosCompra))
            .rejects.toMatchObject({ message: 'El tipo de entrada no pertenece al evento indicado', statusCode: 400 });
        expect(CompraRepository.save).not.toHaveBeenCalled();
    });

    test('rechaza comprar más entradas que el cupo disponible', async () => {
        const { service, CompraRepository } = crearService();

        await expect(service.create({ ...datosCompra, cantidad: 21, total: 3150 }))
            .rejects.toMatchObject({ statusCode: 409 });
        expect(CompraRepository.save).not.toHaveBeenCalled();
    });

    test('rechaza un total distinto al precio por cantidad', async () => {
        const { service, CompraRepository } = crearService();

        await expect(service.create({ ...datosCompra, total: 299 }))
            .rejects.toMatchObject({ statusCode: 400 });
        expect(CompraRepository.save).not.toHaveBeenCalled();
    });

    test('descuenta el cupo cuando crea una compra', async () => {
        const { service, EventoRepository } = crearService();

        await service.create(datosCompra);

        expect(EventoRepository.save).toHaveBeenCalledWith(expect.objectContaining({
            tiposEntrada: [expect.objectContaining({ _id: 'tipo-id', cupo: 18 })],
        }));
    });

    test('cancela una compra confirmada y devuelve las entradas al cupo', async () => {
        const compra = {
            _id: 'compra-id',
            ...datosCompra,
            estado: 'confirmada',
            tipoEntrada: ticket,
            mensajes: [],
        };
        const evento = {
            fecha: new Date(Date.now() + 86400000),
            tiposEntrada: [{ ...ticket, cupo: 18 }],
        };
        const { service, CompraRepository, EventoRepository } = crearService({ compra, evento });

        const cancelada = await service.cancelar('compra-id');

        expect(cancelada.estado).toBe('reembolsada');
        expect(CompraRepository.save).toHaveBeenCalled();
        expect(EventoRepository.save).toHaveBeenCalledWith(expect.objectContaining({
            tiposEntrada: [expect.objectContaining({ cupo: 20 })],
        }));
    });

    test('rechaza cancelar una compra utilizada', async () => {
        const compra = {
            _id: 'compra-id',
            ...datosCompra,
            estado: 'utilizada',
            tipoEntrada: ticket,
            mensajes: [],
        };
        const { service, CompraRepository } = crearService({ compra });

        await expect(service.cancelar('compra-id'))
            .rejects.toMatchObject({ statusCode: 409 });
        expect(CompraRepository.save).not.toHaveBeenCalled();
    });

    test('rechaza cancelar una compra cuando el evento ya ocurrió', async () => {
        const compra = {
            _id: 'compra-id',
            ...datosCompra,
            estado: 'confirmada',
            tipoEntrada: ticket,
            mensajes: [],
        };
        const evento = {
            fecha: new Date(Date.now() - 86400000),
            tiposEntrada: [{ ...ticket, cupo: 18 }],
        };
        const { service, CompraRepository, EventoRepository } = crearService({ compra, evento });

        await expect(service.cancelar('compra-id'))
            .rejects.toMatchObject({ statusCode: 409 });
        expect(CompraRepository.save).not.toHaveBeenCalled();
        expect(EventoRepository.save).not.toHaveBeenCalled();
    });

    test('actualiza la compra usando una copia del ticket embebido', async () => {
        const existente = {
            _id: 'compra-id',
            ...datosCompra,
            comprador: { _id: 'comprador-id' },
            evento: { _id: 'evento-id' },
            tipoEntrada: ticket,
        };
        const { service, CompraRepository } = crearService({ compra: existente });

        const actualizada = await service.update('compra-id', { estado: 'confirmada' });

        expect(CompraRepository.findById).toHaveBeenCalledWith('compra-id');
        expect(actualizada._id).toBe('compra-id');
        expect(actualizada.estado).toBe('confirmada');
        expect(actualizada.tipoEntrada).toEqual(ticket);
    });

    test('path actualiza parcialmente la compra', async () => {
        const existente = {
            _id: 'compra-id',
            ...datosCompra,
            comprador: { _id: 'comprador-id' },
            evento: { _id: 'evento-id' },
            tipoEntrada: ticket,
        };
        const { service } = crearService({ compra: existente });

        const actualizada = await service.path('compra-id', { cantidad: 3, total: 450 });

        expect(actualizada).toMatchObject({ _id: 'compra-id', cantidad: 3, total: 450 });
    });

    test('rechaza actualizar o borrar una compra inexistente', async () => {
        const { service, CompraRepository } = crearService();

        await expect(service.update('missing-id', datosCompra))
            .rejects.toMatchObject({ message: 'La compra con id missing-id no existe', statusCode: 404 });
        await expect(service.delete('missing-id'))
            .rejects.toMatchObject({ message: 'La compra con id missing-id no existe', statusCode: 404 });
        expect(CompraRepository.save).not.toHaveBeenCalled();
        expect(CompraRepository.deleteById).not.toHaveBeenCalled();
    });

    test('borra una compra existente', async () => {
        const existente = { _id: 'compra-id', ...datosCompra };
        const { service, CompraRepository } = crearService({ compra: existente });

        await service.delete('compra-id');

        expect(CompraRepository.deleteById).toHaveBeenCalledWith('compra-id');
    });
});
