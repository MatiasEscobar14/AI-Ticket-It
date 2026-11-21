import CambioEstadoCompra from '../domain/CambioEstadoCompra.js';
import { BadRequestError, NotFoundError } from '../errors/AppError.js';

export default class CambioEstadoCompraService {
    constructor(CambioEstadoCompraRepository, CompraRepository, UsuarioRepository) {
        this.CambioEstadoCompraRepository = CambioEstadoCompraRepository;
        this.CompraRepository = CompraRepository;
        this.UsuarioRepository = UsuarioRepository;
    }

    getAll = async () => this.CambioEstadoCompraRepository.getAll();

    validarCompra = async (compra) => {
        if (!(await this.CompraRepository.exists(compra))) {
            throw new BadRequestError(`La compra con id ${compra} no existe`);
        }
    };

    validarUsuario = async (usuario) => {
        if (!(await this.UsuarioRepository.exists(usuario))) {
            throw new BadRequestError(`El usuario con id ${usuario} no existe`);
        }
    };

    create = async (nuevo) => {
        const cambioEstadoCompra = new CambioEstadoCompra(
            nuevo.compra,
            nuevo.estado,
            nuevo.quien
        );

        await this.validarCompra(cambioEstadoCompra.compra);
        await this.validarUsuario(cambioEstadoCompra.quien);

        return this.CambioEstadoCompraRepository.save(cambioEstadoCompra);
    };

    buscarExistente = async (id) => {
        const existente = await this.CambioEstadoCompraRepository.findById(id);
        if (!existente) {
            throw new NotFoundError(`El cambio de estado de compra con id ${id} no existe`);
        }
        return existente;
    };

    aplicarCambios = async (existente, datos) => {
        CambioEstadoCompra.validarDatos({
            compra: datos.compra,
            estado: datos.estado,
            quien: datos.quien
        });

        await this.validarCompra(datos.compra);
        await this.validarUsuario(datos.quien);

        existente.compra = datos.compra;
        existente.estado = datos.estado;
        existente.quien = datos.quien;
        return this.CambioEstadoCompraRepository.save(existente);
    };

    update = async (id, datos) => this.aplicarCambios(await this.buscarExistente(id), datos);

    path = async (id, cambios) => {
        const existente = await this.buscarExistente(id);
        const valoresActuales = typeof existente.toObject === 'function'
            ? existente.toObject()
            : existente;
        return this.aplicarCambios(existente, { ...valoresActuales, ...cambios });
    };

    delete = async (id) => {
        await this.buscarExistente(id);
        await this.CambioEstadoCompraRepository.deleteById(id);
    };
}
