import { Router } from 'express';
import { mensajeController } from '../dependencias.js';
import validar from '../middlewares/validar.js';
import validateId from '../middlewares/validarId.js';
import { mensajeSchema, mensajePatchSchema } from '../validations/mensaje.js';

const routes = Router();

routes.get('/Mensaje', mensajeController.getAll);
routes.post('/Mensaje', validar(mensajeSchema), mensajeController.create);
routes.put('/Mensaje/:id', validateId, validar(mensajeSchema), mensajeController.update);
routes.patch('/Mensaje/:id', validateId, validar(mensajePatchSchema), mensajeController.path);
routes.delete('/Mensaje/:id', validateId, mensajeController.delete);

export default routes;
