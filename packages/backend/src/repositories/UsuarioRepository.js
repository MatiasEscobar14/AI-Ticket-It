export default class UsuarioRepository {
    constructor() {
        this.registros = new Map();
        this.siguienteId = 1;
    }

    getAll = async () => [...this.registros.values()];

    findById = async (id) => this.registros.get(String(id)) ?? null;

    exists = async (id) => this.registros.has(String(id));

    save = async (usuario) => {
        usuario._id ??= String(this.siguienteId++);
        this.registros.set(String(usuario._id), usuario);
        return usuario;
    };

    deleteById = async (id) => {
        const usuario = await this.findById(id);
        this.registros.delete(String(id));
        return usuario;
    };
}
