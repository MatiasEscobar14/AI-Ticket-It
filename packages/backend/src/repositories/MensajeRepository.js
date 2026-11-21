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

export default class MensajeRepository {
    constructor() {
        this.mensajes = [];
    }

    getAll() {
        return this.mensajes;
    }

    findAll() {
        return this.getAll();
    }

    findById(id) {
        return this.mensajes.find((mensaje) => idOf(mensaje) === id);
    }

    exists(id) {
        return Boolean(this.findById(id));
    }

    save(nuevoMensaje) {
        const id = idOf(nuevoMensaje);
        const indice = this.mensajes.findIndex((mensaje) => idOf(mensaje) === id);
        const anterior = indice === -1 ? null : this.mensajes[indice];
        const mensaje = createRecord({
            ...nuevoMensaje,
            usuario: idOf(nuevoMensaje.usuario),
        }, anterior);

        if (indice === -1) this.mensajes.push(mensaje);
        else this.mensajes[indice] = mensaje;
        return mensaje;
    }

    deleteById(id) {
        const eliminado = this.findById(id);
        this.mensajes = this.mensajes.filter((mensaje) => idOf(mensaje) !== id);
        return eliminado;
    }
}
