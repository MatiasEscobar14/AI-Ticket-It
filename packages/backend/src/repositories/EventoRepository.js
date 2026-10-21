export default class EventoRepository {
    constructor() {
        this.registros = new Map();
        this.siguienteId = 1;
    }

    getAll = async () => [...this.registros.values()];

    findById = async (id) => this.registros.get(String(id)) ?? null;

    exists = async (id) => this.registros.has(String(id));

    save = async (evento) => {
        evento._id ??= String(this.siguienteId++);
        this.registros.set(String(evento._id), evento);
        return evento;
    };

    deleteById = async (id) => {
        const evento = await this.findById(id);
        this.registros.delete(String(id));
        return evento;
    };
}
