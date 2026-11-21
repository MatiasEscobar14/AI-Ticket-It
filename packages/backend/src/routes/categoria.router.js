import { Router } from 'express';
import { categoriaController } from '../dependencias.js';
import validar from '../middlewares/validar.js';
import validateId from '../middlewares/validarId.js';
import { categoriaSchema, categoriaPatchSchema } from '../validations/categoria.js';

const routes = Router();

routes.get('/Categoria', categoriaController.getAll);
routes.post('/Categoria', validar(categoriaSchema), categoriaController.create);
routes.put('/Categoria/:id', validateId, validar(categoriaSchema), categoriaController.update);
routes.patch('/Categoria/:id', validateId, validar(categoriaPatchSchema), categoriaController.path);
routes.delete('/Categoria/:id', validateId, categoriaController.delete);

export default routes;
