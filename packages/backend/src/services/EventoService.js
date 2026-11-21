import Evento from '../domain/Evento.js';
import { NotFoundError } from '../errors/AppError.js';

export default class EventoService {
    constructor(EventoRepository) {
        this.EventoRepository = EventoRepository;
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
        return this.aplicarCambios(existente, { ...valoresActuales, ...datos });
    };

    path = async (id, cambios) => this.update(id, cambios);

    delete = async (id) => {
        await this.buscarExistente(id);
        await this.EventoRepository.deleteById(id);
    };
}
