import Compra from '../domain/Compra.js';
import { BadRequestError, ConflictError, NotFoundError } from '../errors/AppError.js';

const referenciaId = (referencia) => String(referencia?._id ?? referencia?.id ?? referencia);

export default class CompraService {
    constructor(CompraRepository, EventoRepository) {
        this.CompraRepository = CompraRepository;
        this.EventoRepository = EventoRepository;
    }

    getAll = async () => this.CompraRepository.getAll();

    getByComprador = async (compradorId) =>
        this.CompraRepository.findByComprador(compradorId);
    getByEvento = async (eventoId) =>
        this.CompraRepository.findByEvento(eventoId);

    validarTipoEntrada = async (evento, tipoEntrada) => {
        const eventoId = referenciaId(evento);
        const tipoEntradaId = referenciaId(tipoEntrada);
        const eventoExistente = await this.EventoRepository.findById(eventoId);
        if (!eventoExistente) {
            throw new NotFoundError(`El evento con id ${eventoId} no existe`);
        }

        const tiposEntrada = eventoExistente.tiposEntrada ?? [];
        const tipoExistente = tiposEntrada.find(
            (tipo) => referenciaId(tipo) === tipoEntradaId
        );
        if (!tipoExistente) {
            throw new BadRequestError('El tipo de entrada no pertenece al evento indicado');
        }

        return typeof tipoExistente.toObject === 'function'
            ? tipoExistente.toObject({ virtuals: false, transform: false })
            : { ...tipoExistente };
    };

    create = async (nuevo) => {
        const tipoEntrada = await this.validarTipoEntrada(nuevo.evento, nuevo.tipoEntrada);
        if (tipoEntrada.cupo < nuevo.cantidad) {
            throw new ConflictError('No hay suficientes entradas disponibles');
        }
        const total = tipoEntrada.precio * nuevo.cantidad;
        if (nuevo.total !== total) {
            throw new BadRequestError(`El total de la compra debe ser ${total}`);
        }

        const compra = new Compra(
            referenciaId(nuevo.comprador),
            referenciaId(nuevo.evento),
            tipoEntrada,
            nuevo.cantidad,
            total,
            nuevo.estado,
            nuevo.mensajes ?? []
        );
        compra.mensajes = nuevo.mensajes ?? [];
        const guardada = await this.CompraRepository.save(compra);
        await this.actualizarCupo(nuevo.evento, tipoEntrada, -nuevo.cantidad);
        return guardada;
    };

    actualizarCupo = async (eventoId, tipoEntrada, cambio) => {
        const evento = await this.EventoRepository.findById(referenciaId(eventoId));
        if (!evento) {
            throw new NotFoundError(`El evento con id ${referenciaId(eventoId)} no existe`);
        }

        const tipoEntradaId = referenciaId(tipoEntrada);
        const tiposEntrada = evento.tiposEntrada.map((tipo) =>
            referenciaId(tipo) === tipoEntradaId
                ? { ...tipo, cupo: tipo.cupo + cambio }
                : tipo
        );
        return this.EventoRepository.save({ ...evento, tiposEntrada });
    };

    cancelar = async (id) => {
        const compra = await this.buscarExistente(id);
        if (['utilizada', 'cancelada', 'reembolsada'].includes(compra.estado)) {
            throw new ConflictError('No se puede cancelar una compra en su estado actual');
        }

        const evento = await this.EventoRepository.findById(referenciaId(compra.evento));
        if (!evento) {
            throw new ConflictError('No se puede cancelar una compra si el evento no existe');
        }
        if (new Date(evento.fecha).getTime() <= Date.now()) {
            throw new ConflictError('No se puede cancelar una compra después de realizado el evento');
        }

        compra.estado = 'reembolsada';
        const actualizada = await this.CompraRepository.save(compra);
        await this.actualizarCupo(compra.evento, compra.tipoEntrada, compra.cantidad);
        return actualizada;
    };

    buscarExistente = async (id) => {
        const existente = await this.CompraRepository.findById(id);
        if (!existente) {
            throw new NotFoundError(`La compra con id ${id} no existe`);
        }
        return existente;
    };

    aplicarCambios = async (existente, datos) => {
        const tipoEntrada = await this.validarTipoEntrada(datos.evento, datos.tipoEntrada);
        const compra = new Compra(
            referenciaId(datos.comprador),
            referenciaId(datos.evento),
            tipoEntrada,
            datos.cantidad,
            datos.total,
            datos.estado,
            datos.mensajes ?? []
        );
        compra._id = existente._id;
        compra.mensajes = datos.mensajes ?? [];
        return this.CompraRepository.save(compra);
    };

    update = async (id, datos) => {
        const existente = await this.buscarExistente(id);
        if (datos.estado && datos.estado !== existente.estado) {
            const transicionesPermitidas = {
                pendiente: ['confirmada'],
                confirmada: ['utilizada'],
            };
            if (!transicionesPermitidas[existente.estado]?.includes(datos.estado)) {
                throw new ConflictError('No se puede cambiar al estado solicitado');
            }
        }
        const valoresActuales = typeof existente.toObject === 'function'
            ? existente.toObject({ virtuals: false, transform: false })
            : existente;
        return this.aplicarCambios(existente, { ...valoresActuales, ...datos });
    };

    path = async (id, cambios) => this.update(id, cambios);

    delete = async (id) => {
        await this.buscarExistente(id);
        await this.CompraRepository.deleteById(id);
    };
}
