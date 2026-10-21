
export default class CambioEstadoCompraRepository {
    constructor() {
        this.registros = new Map();
        this.siguienteId = 1;
    }

    getAll = async () => [...this.registros.values()];

    findById = async (id) => this.registros.get(String(id)) ?? null;

    exists = async (id) => this.registros.has(String(id));

    save = async (cambioEstadoCompra) => {
        cambioEstadoCompra._id ??= String(this.siguienteId++);
        this.registros.set(String(cambioEstadoCompra._id), cambioEstadoCompra);
        return cambioEstadoCompra;
    };

    deleteById = async (id) => {
        const cambioEstadoCompra = await this.findById(id);
        this.registros.delete(String(id));
        return cambioEstadoCompra;
    };
}