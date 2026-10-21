export default class ReseniaRepository {
    constructor() {
        this.registros = new Map();
        this.siguienteId = 1;
    }

    getAll = async () => [...this.registros.values()];

    findById = async (id) => this.registros.get(String(id)) ?? null;

    exists = async (id) => this.registros.has(String(id));

    save = async (resenia) => {
        resenia._id ??= String(this.siguienteId++);
        this.registros.set(String(resenia._id), resenia);
        return resenia;
    };

    deleteById = async (id) => {
        const resenia = await this.findById(id);
        this.registros.delete(String(id));
        return resenia;
    };
}
