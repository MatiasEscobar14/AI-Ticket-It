import { describe, expect, jest, test } from '@jest/globals';
import CambioEstadoCompraService from '../../../src/services/CambioEstadoCompraService.js';

describe('CambioEstadoCompraService', () => {
    const datosCambio = {
        compra: 'compra-id',
        estado: 'pendiente',
        quien: 'usuario-id',
    };

    const crearService = ({ compraExiste = true, usuarioExiste = true, cambio = null } = {}) => {
        const CambioEstadoCompraRepository = {
            getAll: jest.fn().mockResolvedValue([]),
            findById: jest.fn().mockResolvedValue(cambio),
            save: jest.fn(async (entity) => entity),
            deleteById: jest.fn().mockResolvedValue(undefined),
        };
        const CompraRepository = { exists: jest.fn(async () => compraExiste) };
        const UsuarioRepository = { exists: jest.fn(async () => usuarioExiste) };
        return {
            service: new CambioEstadoCompraService(
                CambioEstadoCompraRepository,
                CompraRepository,
                UsuarioRepository,
            ),
            CambioEstadoCompraRepository,
            CompraRepository,
            UsuarioRepository,
        };
    };

    test('devuelve todos los cambios de estado del repositorio', async () => {
        const { service, CambioEstadoCompraRepository } = crearService();

        await expect(service.getAll()).resolves.toEqual([]);
        expect(CambioEstadoCompraRepository.getAll).toHaveBeenCalledTimes(1);
    });

    test('crea un cambio de estado si existen compra y usuario', async () => {
        const { service, CambioEstadoCompraRepository, CompraRepository, UsuarioRepository } = crearService();

        const creado = await service.create(datosCambio);

        expect(CompraRepository.exists).toHaveBeenCalledWith('compra-id');
        expect(UsuarioRepository.exists).toHaveBeenCalledWith('usuario-id');
        expect(CambioEstadoCompraRepository.save).toHaveBeenCalledTimes(1);
        expect(creado).toMatchObject(datosCambio);
    });

    test('rechaza crear un cambio de estado si la compra no existe', async () => {
        const { service, CambioEstadoCompraRepository } = crearService({ compraExiste: false });

        await expect(service.create(datosCambio))
            .rejects.toMatchObject({ message: 'La compra con id compra-id no existe', statusCode: 400 });
        expect(CambioEstadoCompraRepository.save).not.toHaveBeenCalled();
    });

    test('rechaza crear un cambio de estado si el usuario no existe', async () => {
        const { service, CambioEstadoCompraRepository } = crearService({ usuarioExiste: false });

        await expect(service.create(datosCambio))
            .rejects.toMatchObject({ message: 'El usuario con id usuario-id no existe', statusCode: 400 });
        expect(CambioEstadoCompraRepository.save).not.toHaveBeenCalled();
    });

    test('path actualiza los campos manteniendo los valores no modificados', async () => {
        const cambioExistente = { _id: 'cambio-id', ...datosCambio };
        const { service, CambioEstadoCompraRepository } = crearService({ cambio: cambioExistente });

        const actualizado = await service.path('cambio-id', { estado: 'confirmada' });

        expect(actualizado).toMatchObject({
            _id: 'cambio-id',
            compra: 'compra-id',
            estado: 'confirmada',
            quien: 'usuario-id',
        });
        expect(CambioEstadoCompraRepository.save).toHaveBeenCalledWith(cambioExistente);
    });

    test('rechaza actualizar o borrar un cambio de estado inexistente', async () => {
        const { service, CambioEstadoCompraRepository } = crearService();

        await expect(service.update('missing-id', datosCambio))
            .rejects.toMatchObject({
                message: 'El cambio de estado de compra con id missing-id no existe',
                statusCode: 404,
            });
        await expect(service.delete('missing-id'))
            .rejects.toMatchObject({
                message: 'El cambio de estado de compra con id missing-id no existe',
                statusCode: 404,
            });
        expect(CambioEstadoCompraRepository.save).not.toHaveBeenCalled();
        expect(CambioEstadoCompraRepository.deleteById).not.toHaveBeenCalled();
    });

    test('borra un cambio de estado existente', async () => {
        const { service, CambioEstadoCompraRepository } = crearService({
            cambio: { _id: 'cambio-id', ...datosCambio },
        });

        await service.delete('cambio-id');

        expect(CambioEstadoCompraRepository.deleteById).toHaveBeenCalledWith('cambio-id');
    });
});
