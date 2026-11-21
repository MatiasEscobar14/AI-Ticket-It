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

export default class UsuarioRepository {
    constructor() {
        this.usuarios = [];
    }

    getAll() {
        return this.usuarios;
    }

    findAll() {
        return this.getAll();
    }

    findById(id) {
        return this.usuarios.find((usuario) => idOf(usuario) === id);
    }

    exists(id) {
        return Boolean(this.findById(id));
    }

    save(nuevoUsuario) {
        const id = idOf(nuevoUsuario);
        const indice = this.usuarios.findIndex((usuario) => idOf(usuario) === id);
        const anterior = indice === -1 ? null : this.usuarios[indice];
        const usuario = createRecord({
            ...nuevoUsuario,
            favoritos: (nuevoUsuario.favoritos ?? []).map(idOf),
        }, anterior);

        if (indice === -1) this.usuarios.push(usuario);
        else this.usuarios[indice] = usuario;
        return usuario;
    }

    deleteById(id) {
        const eliminado = this.findById(id);
        this.usuarios = this.usuarios.filter((usuario) => idOf(usuario) !== id);
        return eliminado;
    }
}
