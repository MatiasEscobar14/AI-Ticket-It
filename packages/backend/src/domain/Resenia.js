import { DomainValidationError } from './Errors/DomainError.js';

export default class Resenia {
    constructor(comprador, evento, detalle, puntuacion) {
        Resenia.validarDatos({ comprador, evento, detalle, puntuacion });

        this.comprador = comprador;
        this.evento = evento;
        this.detalle = detalle;
        this.puntuacion = puntuacion;
    }

    static validarDatos({ comprador, evento, detalle, puntuacion }) {
        if (!comprador || !evento || typeof detalle !== 'string' || !detalle.trim()) {
            throw new DomainValidationError('Comprador, evento y detalle son obligatorios');
        }
        if (typeof puntuacion !== 'number' || !Number.isFinite(puntuacion) || puntuacion < 0 || puntuacion > 5) {
            throw new DomainValidationError('La puntuación debe ser un número entre 0 y 5');
        }
    }
}