import TipoEntrada from '../domain/TipoEntrada.js';

export default class TipoEntradaService {
    constructor(TipoEntradaRepository) {
        this.TipoEntradaRepository = TipoEntradaRepository;
    }

    getAll = async () => this.TipoEntradaRepository.getAll();

    create = async (nuevo) => {
        const tipoEntrada = new TipoEntrada(
            nuevo.nombre,
            nuevo.descripcion,
            nuevo.precio,
            nuevo.cupo
        );
        return this.TipoEntradaRepository.save(tipoEntrada);
    };

    buscarExistente = async (id) => {
        const existente = await this.TipoEntradaRepository.findById(id);
        if (!existente) {
            const error = new Error(`El tipo de entrada con id ${id} no existe`);
            error.statusCode = 404;
            throw error;
        }
        return existente;
    };

    aplicarCambios = async (existente, datos) => {
        const tipoEntrada = new TipoEntrada(
            datos.nombre,
            datos.descripcion,
            datos.precio,
            datos.cupo
        );
        tipoEntrada._id = existente._id;
        return this.TipoEntradaRepository.save(tipoEntrada);
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
