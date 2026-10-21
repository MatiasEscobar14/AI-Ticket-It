import { DomainValidationError } from './Errors/DomainError.js';

export default class Evento {
    constructor(nombre, descripcion, categoria, fecha, multimedia = [], organizador) {
        Evento.validarDatos({ nombre, descripcion, categoria, fecha, multimedia, organizador });

        this.nombre = nombre;
        this.descripcion = descripcion;
        this.categoria = categoria;
        this.fecha = fecha;
        this.tiposEntrada = [];
        this.multimedia = multimedia;
        this.organizador = organizador;
    }

    static validarDatos({ nombre, descripcion, categoria, fecha, multimedia = [], organizador }) {
        if (typeof nombre !== 'string' || !nombre.trim()) {
            throw new DomainValidationError('El nombre del evento es obligatorio');
        }
        if (typeof descripcion !== 'string' || !descripcion.trim() || !categoria || !organizador) {
            throw new DomainValidationError('Descripción, categoría y organizador son obligatorios');
        }
        if (!(fecha instanceof Date) || Number.isNaN(fecha.getTime())) {
            throw new DomainValidationError('La fecha del evento debe ser válida');
        }
    }

    agregarTipoEntrada(tipoEntrada) {
        this.tiposEntrada.push(tipoEntrada);
    }

    tuPrecioEstaEntre(min, max) {
        if (!Number.isFinite(min) || !Number.isFinite(max) || min > max) {
            throw new DomainValidationError('El rango de precios no es válido');
        }
        return this.tiposEntrada.some((tipoEntrada) => tipoEntrada.precio >= min && tipoEntrada.precio <= max);
    }
}