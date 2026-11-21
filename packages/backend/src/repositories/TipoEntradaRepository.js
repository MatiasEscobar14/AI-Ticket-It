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

const createEmbeddedRecords = (items = [], previousItems = []) =>
    items.map((item) => createRecord(
        item,
        previousItems.find((previous) => idOf(previous) === idOf(item))
    ));

export default class TipoEntradaRepository {
    constructor(eventoRepository) {
        this.eventoRepository = eventoRepository;
        this.tiposEntrada = [];
    }

    sincronizarConEventos() {
        this.tiposEntrada = this.eventoRepository.getAll().flatMap((evento) =>
            (evento.tiposEntrada ?? []).map((tipoEntrada) => ({
                ...tipoEntrada,
                evento: evento.id,
            }))
        );
        return this.tiposEntrada;
    }

    getAll() {
        return this.sincronizarConEventos();
    }

    findAll() {
        return this.getAll();
    }

    findById(id) {
        return this.sincronizarConEventos().find((tipo) => idOf(tipo) === id);
    }

    exists(id) {
        return Boolean(this.findById(id));
    }

    save(nuevoTipoEntrada, eventoId) {
        const evento = this.eventoRepository.findById(idOf(eventoId));
        if (!evento) return null;

        const id = idOf(nuevoTipoEntrada);
        const indice = (evento.tiposEntrada ?? []).findIndex((tipo) => idOf(tipo) === id);
        if (id && indice === -1) return null;

        const tiposActualizados = [...(evento.tiposEntrada ?? [])];
        const anterior = indice === -1 ? null : tiposActualizados[indice];
        const tipoEntrada = createRecord({
            ...nuevoTipoEntrada,
            evento: evento.id,
        }, anterior);

        if (indice === -1) tiposActualizados.push(tipoEntrada);
        else tiposActualizados[indice] = tipoEntrada;

        this.eventoRepository.save({
            ...evento,
            tiposEntrada: createEmbeddedRecords(tiposActualizados, evento.tiposEntrada),
        });
        this.sincronizarConEventos();
        return this.findById(tipoEntrada.id);
    }

    deleteById(id) {
        const tipoEntrada = this.findById(id);
        if (!tipoEntrada) return null;

        const evento = this.eventoRepository.findById(tipoEntrada.evento);
        if (!evento) return null;
        this.eventoRepository.save({
            ...evento,
            tiposEntrada: evento.tiposEntrada.filter((tipo) => idOf(tipo) !== id),
        });
        this.sincronizarConEventos();
        return tipoEntrada;
    }
}
