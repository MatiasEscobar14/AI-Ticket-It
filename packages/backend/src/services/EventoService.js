import Evento from '../domain/Evento.js';

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
            nuevo.organizador
        );
        evento.tiposEntrada = nuevo.tiposEntrada ?? [];
        return this.EventoRepository.save(evento);
    };

    buscarExistente = async (id) => {
        const existente = await this.EventoRepository.findById(id);
        if (!existente) {
            const error = new Error(`El evento con id ${id} no existe`);
            error.statusCode = 404;
            throw error;
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
            datos.organizador
        );
        evento._id = existente._id;
        evento.tiposEntrada = datos.tiposEntrada ?? [];
        return this.EventoRepository.save(evento);
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
        await this.EventoRepository.deleteById(id);
    };
}
