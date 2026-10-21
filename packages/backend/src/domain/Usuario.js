import { DomainValidationError } from './Errors/DomainError.js';

export default class Usuario {
    constructor(nombre, apellido, favoritos = []) {
        Usuario.validarDatos({ nombre, apellido, favoritos });

        this.nombre = nombre;
        this.apellido = apellido;
        this.favoritos = favoritos;
    }

    static validarDatos({ nombre, apellido, favoritos = [] }) {
        if (typeof nombre !== 'string' || !nombre.trim() || typeof apellido !== 'string' || !apellido.trim()) {
            throw new DomainValidationError('Nombre y apellido son obligatorios');
        }
    }

    agregarFavorito(evento) {
        this.favoritos.push(evento);
    }
} 