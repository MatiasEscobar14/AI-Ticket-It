import { Router } from 'express';
import { eventoController } from '../dependencias.js';
import validar from '../middlewares/validar.js';
import validateId from '../middlewares/validarId.js';
import { eventoSchema, eventoPatchSchema } from '../validations/evento.js';

const routes = Router();

routes.get('/Evento', eventoController.getAll);
routes.post('/Evento', validar(eventoSchema), eventoController.create);
routes.put('/Evento/:id', validateId, validar(eventoSchema), eventoController.update);
routes.patch('/Evento/:id', validateId, validar(eventoPatchSchema), eventoController.path);
routes.delete('/Evento/:id', validateId, eventoController.delete);

export default routes;
