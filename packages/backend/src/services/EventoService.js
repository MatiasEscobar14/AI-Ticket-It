import Evento from '../domain/Evento.js';
import { ConflictError, NotFoundError } from '../errors/AppError.js';

const referenceId = (value) => String(value?._id ?? value?.id ?? value);

export default class EventoService {
    constructor(EventoRepository, CompraRepository) {
        this.EventoRepository = EventoRepository;
        this.CompraRepository = CompraRepository;
    }

    getAll = async () => this.EventoRepository.getAll();

    create = async (nuevo) => {
        const fecha = nuevo.fecha instanceof Date ? nuevo.fecha : new Date(nuevo.fecha);
        const evento = new Evento(
            nuevo.nombre,
            nuevo.descripcion,
            nuevo.categoria,
            fecha,
            nuevo.multimedia ?? [],
            nuevo.organizador,
            nuevo.tiposEntrada ?? []
        );
        return this.EventoRepository.save(evento);
    };

    buscarExistente = async (id) => {
        const existente = await this.EventoRepository.findById(id);
        if (!existente) {
            throw new NotFoundError(`El evento con id ${id} no existe`);
        }
        return existente;
    };

    aplicarCambios = async (existente, datos) => {
        const fecha = datos.fecha instanceof Date ? datos.fecha : new Date(datos.fecha);
        const evento = new Evento(
            datos.nombre,
            datos.descripcion,
            datos.categoria,
            fecha,
            datos.multimedia ?? [],
            datos.organizador,
            datos.tiposEntrada ?? []
        );
        evento._id = existente._id;
        return this.EventoRepository.save(evento);
    };

    update = async (id, datos) => {
        const existente = await this.buscarExistente(id);
        const valoresActuales = typeof existente.toObject === 'function'
            ? existente.toObject({ virtuals: false, transform: false })
            : existente;
        const cambios = { ...valoresActuales, ...datos };

        if (Array.isArray(datos.tiposEntrada)) {
            const compras = await this.CompraRepository.findByEvento(id);
            const idsTiposActualizados = new Set(
                cambios.tiposEntrada.map((tipoEntrada) => referenceId(tipoEntrada))
            );
            const eliminaTipoConCompras = compras.some(
                (compra) => !idsTiposActualizados.has(referenceId(compra.tipoEntrada))
            );
            if (eliminaTipoConCompras) {
                throw new ConflictError('No se puede quitar un tipo de entrada que tiene compras asociadas');
            }
        }

        return this.aplicarCambios(existente, cambios);
    };

    path = async (id, cambios) => this.update(id, cambios);

    delete = async (id) => {
        await this.buscarExistente(id);
        const compras = await this.CompraRepository.findByEvento(id);
        if (compras.length > 0) {
            throw new ConflictError('No se puede eliminar un evento con compras asociadas');
        }
        await this.EventoRepository.deleteById(id);
    };
}
