import Mensaje from '../domain/Mensaje.js';
import { NotFoundError } from '../errors/AppError.js';

export default class MensajeService {
    constructor(MensajeRepository) {
        this.MensajeRepository = MensajeRepository;
    }

    getAll = async () => this.MensajeRepository.getAll();

    create = async (nuevo) => {
        const enviado = nuevo.enviado instanceof Date ? nuevo.enviado : new Date(nuevo.enviado);
        const mensaje = new Mensaje(nuevo.usuario, nuevo.mensaje, enviado);
        return this.MensajeRepository.save(mensaje);
    };

    buscarExistente = async (id) => {
        const existente = await this.MensajeRepository.findById(id);
        if (!existente) {
            throw new NotFoundError(`El mensaje con id ${id} no existe`);
        }
        return existente;
    };

    aplicarCambios = async (existente, datos) => {
        const enviado = datos.enviado instanceof Date ? datos.enviado : new Date(datos.enviado);
        const mensaje = new Mensaje(datos.usuario, datos.mensaje, enviado);
        mensaje._id = existente._id;
        return this.MensajeRepository.save(mensaje);
    };

    update = async (id, datos) => {
        const existente = await this.buscarExistente(id);
        const valoresActuales = typeof existente.toObject === 'function'
            ? existente.toObject()
            : existente;
        return this.aplicarCambios(existente, { ...valoresActuales, ...datos });
    };

    path = async (id, cambios) => this.update(id, cambios);

    delete = async (id) => {
        await this.buscarExistente(id);
        await this.MensajeRepository.deleteById(id);
    };
}
