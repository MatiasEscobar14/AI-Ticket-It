import { describe, expect, jest, test } from '@jest/globals';
import TipoEntradaService from '../../../src/services/TipoEntradaService.js';

describe('TipoEntradaService', () => {
    const datosTipo = {
        nombre: 'General',
        descripcion: 'Entrada general',
        precio: 100,
        cupo: 20,
        evento: 'evento-id',
    };

    const crearService = ({ eventoExiste = true, tipo = null, saveResult } = {}) => {
        const TipoEntradaRepository = {
            getAll: jest.fn().mockResolvedValue([]),
            findById: jest.fn().mockResolvedValue(tipo),
            save: jest.fn(async (entity, eventoId) => saveResult === undefined
                ? { ...entity, evento: eventoId }
                : saveResult),
            deleteById: jest.fn().mockResolvedValue(undefined),
        };
        const EventoRepository = {
            findById: jest.fn(async (id) => eventoExiste ? { _id: id } : null),
        };
        return {
            service: new TipoEntradaService(TipoEntradaRepository, EventoRepository),
            TipoEntradaRepository,
            EventoRepository,
        };
    };

    test('devuelve todas las entradas del repositorio', async () => {
        const { service, TipoEntradaRepository } = crearService();

        await expect(service.getAll()).resolves.toEqual([]);
        expect(TipoEntradaRepository.getAll).toHaveBeenCalledTimes(1);
    });

    test('crea una entrada embebida en el evento', async () => {
        const { service, TipoEntradaRepository, EventoRepository } = crearService();

        const creada = await service.create(datosTipo);

        expect(EventoRepository.findById).toHaveBeenCalledWith('evento-id');
        expect(TipoEntradaRepository.save).toHaveBeenCalledWith(
            expect.objectContaining({
                nombre: 'General',
                descripcion: 'Entrada general',
                precio: 100,
                cupo: 20,
            }),
            'evento-id',
        );
        expect(creada.evento).toBe('evento-id');
    });

    test('rechaza crear una entrada si el evento no existe', async () => {
        const { service, TipoEntradaRepository } = crearService({ eventoExiste: false });

        await expect(service.create(datosTipo))
            .rejects.toMatchObject({ message: 'El evento con id evento-id no existe', statusCode: 404 });
        expect(TipoEntradaRepository.save).not.toHaveBeenCalled();
    });

    test('rechaza la creación si el repositorio no puede agregar la entrada', async () => {
        const { service, TipoEntradaRepository } = crearService({ saveResult: null });

        await expect(service.create(datosTipo))
            .rejects.toMatchObject({
                message: 'No se pudo agregar el tipo de entrada al evento evento-id',
                statusCode: 404,
            });
        expect(TipoEntradaRepository.save).toHaveBeenCalledTimes(1);
    });

    test('actualiza una entrada usando el evento existente cuando se omite del body', async () => {
        const tipoExistente = {
            id: 'tipo-id',
            nombre: 'General',
            descripcion: 'Entrada general',
            precio: 100,
            cupo: 20,
            evento: 'evento-id',
        };
        const { service, TipoEntradaRepository } = crearService({ tipo: tipoExistente });

        const actualizado = await service.update('tipo-id', { precio: 120 });

        expect(TipoEntradaRepository.save).toHaveBeenCalledWith(
            expect.objectContaining({ _id: 'tipo-id', precio: 120 }),
            'evento-id',
        );
        expect(actualizado.evento).toBe('evento-id');
    });

    test('rechaza actualizar o borrar una entrada inexistente', async () => {
        const { service, TipoEntradaRepository } = crearService();

        await expect(service.update('missing-id', datosTipo))
            .rejects.toMatchObject({
                message: 'El tipo de entrada con id missing-id no existe',
                statusCode: 404,
            });
        await expect(service.delete('missing-id'))
            .rejects.toMatchObject({
                message: 'El tipo de entrada con id missing-id no existe',
                statusCode: 404,
            });
        expect(TipoEntradaRepository.save).not.toHaveBeenCalled();
        expect(TipoEntradaRepository.deleteById).not.toHaveBeenCalled();
    });

    test('rechaza actualizar una entrada si el evento de destino no existe', async () => {
        const tipoExistente = {
            id: 'tipo-id',
            nombre: 'General',
            descripcion: 'Entrada general',
            precio: 100,
            cupo: 20,
            evento: 'evento-id',
        };
        const { service, TipoEntradaRepository } = crearService({
            eventoExiste: false,
            tipo: tipoExistente,
        });

        await expect(service.update('tipo-id', { precio: 120 }))
            .rejects.toMatchObject({ message: 'El evento con id evento-id no existe', statusCode: 404 });
        expect(TipoEntradaRepository.save).not.toHaveBeenCalled();
    });

    test('borra una entrada existente', async () => {
        const tipoExistente = { id: 'tipo-id', evento: 'evento-id' };
        const { service, TipoEntradaRepository } = crearService({ tipo: tipoExistente });

        await service.delete('tipo-id');

        expect(TipoEntradaRepository.deleteById).toHaveBeenCalledWith('tipo-id');
    });
});
