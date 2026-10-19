import { DomainValidationError } from './Errors/DomainError.js';

export default class Categoria {
    constructor(nombre, descripcion) {
        if (typeof nombre !== 'string' || !nombre.trim() || typeof descripcion !== 'string' || !descripcion.trim()) {
            throw new DomainValidationError('Nombre y descripción son obligatorios');
}
        this.nombre = nombre;
        this.descripcion = descripcion;
    }
}