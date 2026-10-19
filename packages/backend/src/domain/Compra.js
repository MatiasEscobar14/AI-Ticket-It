import { DomainValidationError } from './Errors/DomainError.js';
import { EstadoCompra } from './EstadoCompra.js';

export default class Compra {
    constructor(comprador, evento, tipoEntrada, cantidad, total, estado, mensajes = []) {
        if (!comprador || !evento || !tipoEntrada) {
            throw new DomainValidationError('Comprador, evento y tipo de entrada son obligatorios');
    }
        if (!Number.isInteger(cantidad) || cantidad <= 0) {
            throw new DomainValidationError('La cantidad debe ser un entero mayor que cero');
        }
        if (typeof total !== 'number' || !Number.isFinite(total) || total < 0) {
            throw new DomainValidationError('El total debe ser un número no negativo');
        }
        if (!Object.values(EstadoCompra).includes(estado)) {
            throw new DomainValidationError('El estado de compra no es válido');
        }
        if (!Array.isArray(mensajes)) {
            throw new DomainValidationError('Los mensajes deben ser una lista');
        }

        this.comprador = comprador;
        this.evento = evento;
        this.tipoEntrada = tipoEntrada;
        this.cantidad = cantidad;
        this.total = total;
        this.estado = estado;
        this.mensajes = [...mensajes];
    }

    actualizarEstado(estado) {
        if (!Object.values(EstadoCompra).includes(estado)) {
            throw new DomainValidationError('El estado de compra no es válido');
        }
        this.estado = estado;
    }
}
