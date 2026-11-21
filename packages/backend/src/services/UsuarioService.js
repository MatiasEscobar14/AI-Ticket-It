import Usuario from '../domain/Usuario.js';
import { NotFoundError } from '../errors/AppError.js';

export default class UsuarioService {
    constructor(UsuarioRepository) {
        this.UsuarioRepository = UsuarioRepository;
    }

    getAll = async () => this.UsuarioRepository.getAll();

    create = async (nuevo) => {
        const usuario = new Usuario(nuevo.nombre, nuevo.apellido, nuevo.favoritos ?? []);
        return this.UsuarioRepository.save(usuario);
    };

    buscarExistente = async (id) => {
        const existente = await this.UsuarioRepository.findById(id);
        if (!existente) {
            throw new NotFoundError(`El usuario con id ${id} no existe`);
        }
        return existente;
    };

    aplicarCambios = async (existente, datos) => {
        const usuario = new Usuario(datos.nombre, datos.apellido, datos.favoritos ?? []);
        usuario._id = existente._id;
        return this.UsuarioRepository.save(usuario);
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
        await this.UsuarioRepository.deleteById(id);
    };
}
