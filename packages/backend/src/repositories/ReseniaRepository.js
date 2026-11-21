import { randomBytes } from 'node:crypto';

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

export default class ReseniaRepository {
    constructor() {
        this.resenias = [];
    }

    getAll() {
        return this.resenias;
    }

    findAll() {
        return this.getAll();
    }

    findById(id) {
        return this.resenias.find((resenia) => idOf(resenia) === id);
    }

    exists(id) {
        return Boolean(this.findById(id));
    }

    save(nuevaResenia) {
        const id = idOf(nuevaResenia);
        const indice = this.resenias.findIndex((resenia) => idOf(resenia) === id);
        const anterior = indice === -1 ? null : this.resenias[indice];
        const resenia = createRecord({
            ...nuevaResenia,
            comprador: idOf(nuevaResenia.comprador),
            evento: idOf(nuevaResenia.evento),
        }, anterior);

        if (indice === -1) this.resenias.push(resenia);
        else this.resenias[indice] = resenia;
        return resenia;
    }

    deleteById(id) {
        const eliminada = this.findById(id);
        this.resenias = this.resenias.filter((resenia) => idOf(resenia) !== id);
        return eliminada;
    }
}
