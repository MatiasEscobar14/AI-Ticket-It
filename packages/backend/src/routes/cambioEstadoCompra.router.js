import { Router } from 'express';
import { cambioEstadoCompraController } from '../dependencias.js';
import validar from '../middlewares/validar.js';
import validateId from '../middlewares/validarId.js';
import { cambioEstadoCompraSchema, cambioEstadoCompraPatchSchema } from '../validations/cambioEstadoCompra.js';

const routes = Router();

routes.get('/CambioEstadoCompra', cambioEstadoCompraController.getAll);
routes.post('/CambioEstadoCompra', validar(cambioEstadoCompraSchema), cambioEstadoCompraController.create);
routes.put('/CambioEstadoCompra/:id', validateId, validar(cambioEstadoCompraSchema), cambioEstadoCompraController.update);
routes.patch('/CambioEstadoCompra/:id', validateId, validar(cambioEstadoCompraPatchSchema), cambioEstadoCompraController.path);
routes.delete('/CambioEstadoCompra/:id', validateId, cambioEstadoCompraController.delete);

export default routes;
