import { Router } from 'express';
import { usuarioController } from '../dependencias.js';
import validar from '../middlewares/validar.js';
import validateId from '../middlewares/validarId.js';
import { usuarioSchema, usuarioPatchSchema } from '../validations/usuario.js';

const routes = Router();

routes.get('/Usuario', usuarioController.getAll);
routes.post('/Usuario', validar(usuarioSchema), usuarioController.create);
routes.put('/Usuario/:id', validateId, validar(usuarioSchema), usuarioController.update);
routes.patch('/Usuario/:id', validateId, validar(usuarioPatchSchema), usuarioController.path);
routes.delete('/Usuario/:id', validateId, usuarioController.delete);

export default routes;
