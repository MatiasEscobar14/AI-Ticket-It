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

export default class CambioEstadoCompraRepository {
    constructor() {
        this.cambiosEstadoCompra = [];
    }

    getAll() {
        return this.cambiosEstadoCompra;
    }

    findAll() {
        return this.getAll();
    }

    findById(id) {
        return this.cambiosEstadoCompra.find((cambio) => idOf(cambio) === id);
    }

    exists(id) {
        return Boolean(this.findById(id));
    }

    save(nuevoCambio) {
        const id = idOf(nuevoCambio);
        const indice = this.cambiosEstadoCompra.findIndex((cambio) => idOf(cambio) === id);
        const anterior = indice === -1 ? null : this.cambiosEstadoCompra[indice];
        const cambio = createRecord({
            ...nuevoCambio,
            compra: idOf(nuevoCambio.compra),
            quien: idOf(nuevoCambio.quien),
        }, anterior);

        if (indice === -1) this.cambiosEstadoCompra.push(cambio);
        else this.cambiosEstadoCompra[indice] = cambio;
        return cambio;
    }

    deleteById(id) {
        const eliminado = this.findById(id);
        this.cambiosEstadoCompra = this.cambiosEstadoCompra.filter(
            (cambio) => idOf(cambio) !== id
        );
        return eliminado;
    }
}
