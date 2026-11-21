import Resenia from '../domain/Resenia.js';
import { ConflictError, NotFoundError } from '../errors/AppError.js';

export default class ReseniaService {
    constructor(ReseniaRepository, CompraRepository = null) {
        this.ReseniaRepository = ReseniaRepository;
        this.CompraRepository = CompraRepository;
    }

    getAll = async () => this.ReseniaRepository.getAll();

    create = async (nuevo) => {
        if (this.CompraRepository) {
            const compras = await this.CompraRepository.findByComprador(nuevo.comprador);
            const puedeReseniar = compras.some((compra) =>
                String(compra.evento?._id ?? compra.evento?.id ?? compra.evento) === String(nuevo.evento)
                && compra.estado === 'utilizada'
            );
            if (!puedeReseniar) {
                throw new ConflictError('Solo podés reseñar un evento después de utilizar una entrada');
            }

            const yaReseniada = (await this.getAll()).some((resenia) =>
                String(resenia.comprador?._id ?? resenia.comprador?.id ?? resenia.comprador) === String(nuevo.comprador)
                && String(resenia.evento?._id ?? resenia.evento?.id ?? resenia.evento) === String(nuevo.evento)
            );
            if (yaReseniada) {
                throw new ConflictError('Ya existe una reseña para esta compra');
            }
        }

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
            throw new NotFoundError(`La reseña con id ${id} no existe`);
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
