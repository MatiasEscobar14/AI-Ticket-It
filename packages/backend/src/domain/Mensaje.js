import { DomainValidationError } from './Errors/DomainError.js';

export default class Mensaje {
    constructor(usuario, mensaje) {
        Mensaje.validarDatos({ usuario, mensaje });

        this.usuario = usuario;
        this.mensaje = mensaje;
        this.enviado = new Date();
    }

    static validarDatos({ usuario, mensaje }) {
        if (!usuario || typeof mensaje !== 'string' || !mensaje.trim()) {
            throw new DomainValidationError('Usuario y contenido del mensaje son obligatorios');
        }
    }
}