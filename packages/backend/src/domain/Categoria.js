import { DomainValidationError } from './Errors/DomainError.js';

export default class Categoria {
    constructor(nombre, descripcion) {
        Categoria.validarDatos({ nombre, descripcion });

        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    static validarDatos({ nombre, descripcion }) {
        if (typeof nombre !== 'string' || !nombre.trim() || typeof descripcion !== 'string' || !descripcion.trim()) {
            throw new DomainValidationError('Nombre y descripción son obligatorios');
        }
    }
}