import { DomainValidationError } from './Errors/DomainError.js';

export default class Mensaje {
    constructor(usuario, mensaje, enviado) {
        Mensaje.validarDatos({ usuario, mensaje, enviado });

        this.usuario = usuario;
        this.mensaje = mensaje;
        this.enviado = enviado;
    }

    static validarDatos({ usuario, mensaje, enviado }) {
        if (!usuario || typeof mensaje !== 'string' || !mensaje.trim()) {
            throw new DomainValidationError('Usuario y contenido del mensaje son obligatorios');
        }
        if (!(enviado instanceof Date) || Number.isNaN(enviado.getTime())) {
            throw new DomainValidationError('La fecha de envío debe ser válida');
        }
    }
}