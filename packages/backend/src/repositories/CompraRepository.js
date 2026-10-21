export default class CompraRepository {
    constructor() {
        this.registros = new Map();
        this.siguienteId = 1;
    }

    getAll = async () => [...this.registros.values()];

    findById = async (id) => this.registros.get(String(id)) ?? null;

    exists = async (id) => this.registros.has(String(id));

    save = async (compra) => {
        compra._id ??= String(this.siguienteId++);
        this.registros.set(String(compra._id), compra);
        return compra;
    };

    deleteById = async (id) => {
        const compra = await this.findById(id);
        this.registros.delete(String(id));
        return compra;
    };
}
