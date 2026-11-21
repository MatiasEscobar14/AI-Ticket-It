import { Router } from 'express';
import { reseniaController } from '../dependencias.js';
import validar from '../middlewares/validar.js';
import validateId from '../middlewares/validarId.js';
import { reseniaSchema, reseniaPatchSchema } from '../validations/resenia.js';

const routes = Router();

routes.get('/Resenia', reseniaController.getAll);
routes.post('/Resenia', validar(reseniaSchema), reseniaController.create);
routes.put('/Resenia/:id', validateId, validar(reseniaSchema), reseniaController.update);
routes.patch('/Resenia/:id', validateId, validar(reseniaPatchSchema), reseniaController.path);
routes.delete('/Resenia/:id', validateId, reseniaController.delete);

export default routes;
