import { Router } from 'express';
import { tipoEntradaController } from '../dependencias.js';
import validar from '../middlewares/validar.js';
import validateId from '../middlewares/validarId.js';
import { tipoEntradaSchema, tipoEntradaPatchSchema } from '../validations/tipoEntrada.js';

const routes = Router();

routes.get('/TipoEntrada', tipoEntradaController.getAll);
routes.post('/TipoEntrada', validar(tipoEntradaSchema), tipoEntradaController.create);
routes.put('/TipoEntrada/:id', validateId, validar(tipoEntradaSchema), tipoEntradaController.update);
routes.patch('/TipoEntrada/:id', validateId, validar(tipoEntradaPatchSchema), tipoEntradaController.path);
routes.delete('/TipoEntrada/:id', validateId, tipoEntradaController.delete);

export default routes;
