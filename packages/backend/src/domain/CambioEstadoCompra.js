import { DomainValidationError } from './Errors/DomainError.js';
import { EstadoCompra } from './EstadoCompra.js';

export default class CambioEstadoCompra {
    constructor(compra, estado, quien) {
        CambioEstadoCompra.validarDatos({ compra, estado, quien });

        this.compra = compra;
        this.estado = estado;
        this.quien = quien;
        this.fechaHora = new Date();
    }

    static validarDatos({ compra, estado, quien }) {
        if (!compra || !estado || !quien) {
            throw new DomainValidationError('La compra, el estado y el usuario son obligatorios');
        }
        if (!Object.values(EstadoCompra).includes(estado)) {
            throw new DomainValidationError('El estado de compra no es válido');
        }
    }
}