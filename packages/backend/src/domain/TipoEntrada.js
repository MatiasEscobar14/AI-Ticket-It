import { DomainValidationError } from './Errors/DomainError.js';

export default class TipoEntrada {
    constructor(nombre, descripcion, precio, cupo) {
        if (typeof nombre !== 'string' || !nombre.trim()) {
            throw new DomainValidationError('El nombre del tipo de entrada es obligatorio');
    }
        if (typeof descripcion !== 'string' || !descripcion.trim()) {
            throw new DomainValidationError('La descripción del tipo de entrada es obligatoria');
        }
        if (typeof precio !== 'number' || !Number.isFinite(precio) || precio < 0) {
            throw new DomainValidationError('El precio debe ser un número no negativo');
        }
        if (!Number.isInteger(cupo) || cupo < 0) {
            throw new DomainValidationError('El cupo debe ser un entero no negativo');
        }

        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.cupo = cupo;
    }

    hayCupoPara(cantidad) {
        if (!Number.isInteger(cantidad) || cantidad <= 0) {
            throw new DomainValidationError('La cantidad debe ser un entero mayor que cero');
        }
        return this.cupo >= cantidad;
    }
}
