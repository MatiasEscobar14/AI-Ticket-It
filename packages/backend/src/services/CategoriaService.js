import Categoria from '../domain/Categoria.js';
import { NotFoundError } from '../errors/AppError.js';

export default class CategoriaService {
    constructor(CategoriaRepository) {
        this.CategoriaRepository = CategoriaRepository;
    }

    getAll = async () => this.CategoriaRepository.getAll();

    create = async (nuevo) => {
        const categoria = new Categoria(nuevo.nombre, nuevo.descripcion);
        return this.CategoriaRepository.save(categoria);
    };

    buscarExistente = async (id) => {
        const existente = await this.CategoriaRepository.findById(id);
        if (!existente) {
            throw new NotFoundError(`La categoría con id ${id} no existe`);
        }
        return existente;
    };

    aplicarCambios = async (existente, datos) => {
        const categoria = new Categoria(datos.nombre, datos.descripcion);
        categoria._id = existente._id;
        return this.CategoriaRepository.save(categoria);
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
        await this.CategoriaRepository.deleteById(id);
    };
}
