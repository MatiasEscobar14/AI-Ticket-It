import Compra from '../domain/Compra.js';

export default class CompraService {
    constructor(CompraRepository) {
        this.CompraRepository = CompraRepository;
    }

    getAll = async () => this.CompraRepository.getAll();

    create = async (nuevo) => {
        const compra = new Compra(
            nuevo.comprador,
            nuevo.evento,
            nuevo.tipoEntrada,
            nuevo.cantidad,
            nuevo.total,
            nuevo.estado,
            nuevo.mensajes ?? []
        );
        compra.mensajes = nuevo.mensajes ?? [];
        return this.CompraRepository.save(compra);
    };

    buscarExistente = async (id) => {
        const existente = await this.CompraRepository.findById(id);
        if (!existente) {
            const error = new Error(`La compra con id ${id} no existe`);
            error.statusCode = 404;
            throw error;
        }
        return existente;
    };

    aplicarCambios = async (existente, datos) => {
        const compra = new Compra(
            datos.comprador,
            datos.evento,
            datos.tipoEntrada,
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
        const valoresActuales = typeof existente.toObject === 'function'
            ? existente.toObject()
            : existente;
        return this.aplicarCambios(existente, { ...valoresActuales, ...datos });
    };

    path = async (id, cambios) => this.update(id, cambios);

    delete = async (id) => {
        await this.buscarExistente(id);
        await this.CompraRepository.deleteById(id);
    };
}
