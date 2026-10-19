import { DomainValidationError } from './Errors/DomainError.js';

export default class Usuario {
    constructor(nombre, apellido, favoritos = []) {
        if (typeof nombre !== 'string' || !nombre.trim() || typeof apellido !== 'string' || !apellido.trim()) {
            throw new DomainValidationError('Nombre y apellido son obligatorios');
    }
        if (!Array.isArray(favoritos)) {
            throw new DomainValidationError('Los favoritos deben ser una lista');
        }

        this.nombre = nombre;
        this.apellido = apellido;
        this.favoritos = [...favoritos];
    }
}