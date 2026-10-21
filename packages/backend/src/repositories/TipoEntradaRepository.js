export default class TipoEntradaRepository {
    constructor() {
        this.registros = new Map();
        this.siguienteId = 1;
    }

    getAll = async () => [...this.registros.values()];

    findById = async (id) => this.registros.get(String(id)) ?? null;

    exists = async (id) => this.registros.has(String(id));

    save = async (tipoEntrada) => {
        tipoEntrada._id ??= String(this.siguienteId++);
        this.registros.set(String(tipoEntrada._id), tipoEntrada);
        return tipoEntrada;
    };

    deleteById = async (id) => {
        const tipoEntrada = await this.findById(id);
        this.registros.delete(String(id));
        return tipoEntrada;
    };
}
