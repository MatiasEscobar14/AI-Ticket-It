import TipoEntrada from '../domain/TipoEntrada.js';
import { NotFoundError } from '../errors/AppError.js';

export default class TipoEntradaService {
    constructor(TipoEntradaRepository, EventoRepository) {
        this.TipoEntradaRepository = TipoEntradaRepository;
        this.EventoRepository = EventoRepository;
    }

    getAll = async () => this.TipoEntradaRepository.getAll();

    buscarEvento = async (id) => {
        const evento = await this.EventoRepository.findById(id);
        if (!evento) {
            throw new NotFoundError(`El evento con id ${id} no existe`);
        }
        return evento;
    };

    create = async (nuevo) => {
        await this.buscarEvento(nuevo.evento);
        const tipoEntrada = new TipoEntrada(
            nuevo.nombre,
            nuevo.descripcion,
            nuevo.precio,
            nuevo.cupo
        );
        const guardado = await this.TipoEntradaRepository.save(tipoEntrada, nuevo.evento);
        if (!guardado) {
            throw new NotFoundError(`No se pudo agregar el tipo de entrada al evento ${nuevo.evento}`);
        }
        return guardado;
    };

    buscarExistente = async (id) => {
        const existente = await this.TipoEntradaRepository.findById(id);
        if (!existente) {
            throw new NotFoundError(`El tipo de entrada con id ${id} no existe`);
        }
        return existente;
    };

    aplicarCambios = async (existente, datos) => {
        const eventoId = datos.evento ?? existente.evento;
        await this.buscarEvento(eventoId);
        const tipoEntrada = new TipoEntrada(
            datos.nombre,
            datos.descripcion,
            datos.precio,
            datos.cupo
        );
        tipoEntrada._id = existente._id ?? existente.id;
        const guardado = await this.TipoEntradaRepository.save(tipoEntrada, eventoId);
        if (!guardado) {
            throw new NotFoundError(`El tipo de entrada con id ${existente._id ?? existente.id} no existe`);
        }
        return guardado;
    };

    update = async (id, datos) => {
        const existente = await this.buscarExistente(id);
        const valoresActuales = typeof existente.toObject === 'function'
            ? existente.toObject()
            : existente;
        return this.aplicarCambios(existente, { ...valoresActuales, ...datos });
    };

    path = async (id, cambios) => this.update(id, cambios);

    delete = async (id) => {
        await this.buscarExistente(id);
        await this.TipoEntradaRepository.deleteById(id);
    };
}
