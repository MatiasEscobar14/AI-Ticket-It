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

const createEmbeddedRecords = (items = [], previousItems = []) =>
    items.map((item) => createRecord(
        item,
        previousItems.find((previous) => idOf(previous) === idOf(item))
    ));

export default class CompraRepository {
    constructor() {
        this.compras = [];
    }

    getAll() {
        return this.compras;
    }

    findAll() {
        return this.getAll();
    }

    findByComprador(compradorId) {
        return this.compras.filter((compra) => idOf(compra.comprador) === compradorId);
    }

    findByEvento(eventoId) {
        return this.compras.filter((compra) => idOf(compra.evento) === eventoId);
    }

    findById(id) {
        return this.compras.find((compra) => idOf(compra) === id);
    }

    exists(id) {
        return Boolean(this.findById(id));
    }

    save(nuevaCompra) {
        const id = idOf(nuevaCompra);
        const indice = this.compras.findIndex((compra) => idOf(compra) === id);
        const anterior = indice === -1 ? null : this.compras[indice];
        const compra = createRecord({
            ...nuevaCompra,
            comprador: idOf(nuevaCompra.comprador),
            evento: idOf(nuevaCompra.evento),
            tipoEntrada: nuevaCompra.tipoEntrada
                ? createRecord(nuevaCompra.tipoEntrada, anterior?.tipoEntrada)
                : nuevaCompra.tipoEntrada,
            mensajes: createEmbeddedRecords(nuevaCompra.mensajes, anterior?.mensajes).map((mensaje) => ({
                ...mensaje,
                usuario: idOf(mensaje.usuario),
            })),
        }, anterior);

        if (indice === -1) this.compras.push(compra);
        else this.compras[indice] = compra;
        return compra;
    }

    deleteById(id) {
        const eliminada = this.findById(id);
        this.compras = this.compras.filter((compra) => idOf(compra) !== id);
        return eliminada;
    }
}
