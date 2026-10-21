export default class MensajeRepository {
    constructor() {
        this.registros = new Map();
        this.siguienteId = 1;
    }

    getAll = async () => [...this.registros.values()];

    findById = async (id) => this.registros.get(String(id)) ?? null;

    exists = async (id) => this.registros.has(String(id));

    save = async (mensaje) => {
        mensaje._id ??= String(this.siguienteId++);
        this.registros.set(String(mensaje._id), mensaje);
        return mensaje;
    };

    deleteById = async (id) => {
        const mensaje = await this.findById(id);
        this.registros.delete(String(id));
        return mensaje;
    };
}
