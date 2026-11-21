import { randomBytes } from 'node:crypto';
import { ConflictError } from '../errors/AppError.js';

const idOf = (value) => {
    const id = value && typeof value === 'object' ? value._id ?? value.id : value;
    return id === undefined || id === null ? '' : String(id);
};

const createRecord = (value, previous) => {
    const id = idOf(value._id ?? value.id) || randomBytes(12).toString('hex');
    const now = new Date();
    const record = {
        ...value,
        id,
        createdAt: previous?.createdAt ?? value.createdAt ?? now,
        updatedAt: now,
    };
    delete record._id;
    Object.defineProperty(record, '_id', { value: id, writable: true });
    return record;
};

export default class CategoriaRepository {
    constructor() {
        this.categorias = [];
    }

    getAll() {
        return this.categorias;
    }

    findAll() {
        return this.getAll();
    }

    findById(id) {
        return this.categorias.find((categoria) => idOf(categoria) === id);
    }

    exists(id) {
        return Boolean(this.findById(id));
    }

    save(nuevaCategoria) {
        const id = idOf(nuevaCategoria);
        const duplicada = this.categorias.some(
            (categoria) => categoria.nombre === nuevaCategoria.nombre && idOf(categoria) !== id
        );
        if (duplicada) {
            throw new ConflictError(`Ya existe una categoría con el nombre '${nuevaCategoria.nombre}'`);
        }

        const indice = this.categorias.findIndex((categoria) => idOf(categoria) === id);
        const anterior = indice === -1 ? null : this.categorias[indice];
        const guardada = createRecord(nuevaCategoria, anterior);
        if (indice === -1) this.categorias.push(guardada);
        else this.categorias[indice] = guardada;
        return guardada;
    }

    deleteById(id) {
        const eliminada = this.findById(id);
        this.categorias = this.categorias.filter((categoria) => idOf(categoria) !== id);
        return eliminada;
    }
}
