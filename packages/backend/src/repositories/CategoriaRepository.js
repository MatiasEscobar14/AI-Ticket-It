export default class CategoriaRepository {
    constructor() {
        this.registros = new Map();
        this.siguienteId = 1;
    }

    getAll = async () => [...this.registros.values()];

    findById = async (id) => this.registros.get(String(id)) ?? null;

    exists = async (id) => this.registros.has(String(id));

    save = async (categoria) => {
        categoria._id ??= String(this.siguienteId++);
        this.registros.set(String(categoria._id), categoria);
        return categoria;
    };

    deleteById = async (id) => {
        const categoria = await this.findById(id);
        this.registros.delete(String(id));
        return categoria;
    };
}
