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

export default class EventoRepository {
    constructor() {
        this.eventos = [];
    }

    getAll() {
        return this.eventos;
    }

    findAll() {
        return this.getAll();
    }

    findById(id) {
        return this.eventos.find((evento) => idOf(evento) === id);
    }

    exists(id) {
        return Boolean(this.findById(id));
    }

    save(nuevoEvento) {
        const id = idOf(nuevoEvento);
        const indice = this.eventos.findIndex((evento) => idOf(evento) === id);
        const anterior = indice === -1 ? null : this.eventos[indice];
        const evento = createRecord({
            ...nuevoEvento,
            categoria: idOf(nuevoEvento.categoria),
            organizador: idOf(nuevoEvento.organizador),
            tiposEntrada: createEmbeddedRecords(
                nuevoEvento.tiposEntrada,
                anterior?.tiposEntrada
            ),
        }, anterior);

        if (indice === -1) this.eventos.push(evento);
        else this.eventos[indice] = evento;
        return evento;
    }

    deleteById(id) {
        const eliminado = this.findById(id);
        this.eventos = this.eventos.filter((evento) => idOf(evento) !== id);
        return eliminado;
    }
}
