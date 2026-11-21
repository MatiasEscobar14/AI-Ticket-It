import { Router } from 'express';
import { compraController } from '../dependencias.js';
import validar from '../middlewares/validar.js';
import validateId from '../middlewares/validarId.js';
import { compraSchema, compraPatchSchema } from '../validations/compra.js';
const routes = Router();

routes.get('/Compra', compraController.getAll);
routes.get('/Compra/comprador/:id', validateId, compraController.getByComprador);
routes.get('/Compra/evento/:id', validateId, compraController.getByEvento);
routes.post('/Compra/:id/cancelar', validateId, compraController.cancelar);
routes.post('/Compra', validar(compraSchema), compraController.create);
routes.put('/Compra/:id', validateId, validar(compraSchema), compraController.update);
routes.patch('/Compra/:id', validateId, validar(compraPatchSchema), compraController.path);
routes.delete('/Compra/:id', validateId, compraController.delete);

export default routes;
