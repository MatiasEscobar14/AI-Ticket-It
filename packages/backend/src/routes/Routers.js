import { Router } from 'express';
import cambioEstadoCompraRoutes from './cambioEstadoCompra.router.js';
import compraRoutes from './compra.router.js';
import reseniaRoutes from './resenia.router.js';
import usuarioRoutes from './usuario.router.js';
import mensajeRoutes from './mensaje.router.js';
import eventoRoutes from './evento.router.js';
import categoriaRoutes from './categoria.router.js';
import tipoEntradaRoutes from './tipoEntrada.router.js';
import healthRoutes from './health.router.js';

const routes = Router();

routes.use(healthRoutes);
routes.use(usuarioRoutes);
routes.use(compraRoutes);
routes.use(reseniaRoutes);
routes.use(mensajeRoutes);
routes.use(eventoRoutes);
routes.use(categoriaRoutes);
routes.use(tipoEntradaRoutes);
routes.use(cambioEstadoCompraRoutes);

export default routes;
