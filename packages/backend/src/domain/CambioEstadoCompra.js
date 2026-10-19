import { DomainValidationError } from './Errors/DomainError.js';
import { EstadoCompra } from './EstadoCompra.js';

export default class CambioEstadoCompra {
    constructor(compra, estado, quien, fechaHora) {
        if (!compra || !Object.values(EstadoCompra).includes(estado) || !quien) {
            throw new DomainValidationError('Compra, estado y usuario son obligatorios y válidos');
        }
        if (!(fechaHora instanceof Date) || Number.isNaN(fechaHora.getTime())) {
            throw new DomainValidationError('La fecha del cambio debe ser válida');
        }

        this.compra = compra;
        this.estado = estado;
        this.quien = quien;
        this.fechaHora = fechaHora;
    }
}