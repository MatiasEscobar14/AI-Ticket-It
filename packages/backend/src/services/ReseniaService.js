import Resenia from '../domain/Resenia.js';

export default class ReseniaService {
    constructor(ReseniaRepository) {
        this.ReseniaRepository = ReseniaRepository;
    }

    getAll = async () => this.ReseniaRepository.getAll();

    create = async (nuevo) => {
        const resenia = new Resenia(
            nuevo.comprador,
            nuevo.evento,
            nuevo.detalle,
            nuevo.puntuacion
        );
        return this.ReseniaRepository.save(resenia);
    };

    buscarExistente = async (id) => {
        const existente = await this.ReseniaRepository.findById(id);
        if (!existente) {
            const error = new Error(`La reseña con id ${id} no existe`);
            error.statusCode = 404;
            throw error;
        }
        return existente;
    };

    aplicarCambios = async (existente, datos) => {
        const resenia = new Resenia(
            datos.comprador,
            datos.evento,
            datos.detalle,
            datos.puntuacion
        );
        resenia._id = existente._id;
        return this.ReseniaRepository.save(resenia);
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
        await this.ReseniaRepository.deleteById(id);
    };
}
