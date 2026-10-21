import { Router } from 'express';
import { getHealth } from '../controllers/health.controller.js';

import CambioEstadoCompraRepository from '../repositories/CambioEstadoCompraRepository.js';
import CompraRepository from '../repositories/CompraRepository.js';
import ReseniaRepository from '../repositories/ReseniaRepository.js';
import UsuarioRepository from '../repositories/UsuarioRepository.js';
import MensajeRepository from '../repositories/MensajeRepository.js';
import EventoRepository from '../repositories/EventoRepository.js';
import CategoriaRepository from '../repositories/CategoriaRepository.js';
import TipoEntradaRepository from '../repositories/TipoEntradaRepository.js';

import CambioEstadoCompraService from '../services/CambioEstadoCompraService.js';
import CompraService from '../services/CompraService.js';
import ReseniaService from '../services/ReseniaService.js';
import UsuarioService from '../services/UsuarioService.js';
import MensajeService from '../services/MensajeService.js';
import EventoService from '../services/EventoService.js';
import CategoriaService from '../services/CategoriaService.js';
import TipoEntradaService from '../services/TipoEntradaService.js';

import CambioEstadoCompraController from '../controllers/CambioEstadoCompraController.js';
import CompraController from '../controllers/CompraController.js';
import ReseniaController from '../controllers/ReseniaController.js';
import UsuarioController from '../controllers/UsuarioController.js';
import MensajeController from '../controllers/MensajeController.js';
import EventoController from '../controllers/EventoController.js';
import CategoriaController from '../controllers/CategoriaController.js';
import TipoEntradaController from '../controllers/TipoEntradaController.js';

const usuarioRepository = new UsuarioRepository();
const compraRepository = new CompraRepository();
const reseniaRepository = new ReseniaRepository();
const mensajeRepository = new MensajeRepository();
const eventoRepository = new EventoRepository();
const categoriaRepository = new CategoriaRepository();
const tipoEntradaRepository = new TipoEntradaRepository();
const cambioEstadoCompraRepository = new CambioEstadoCompraRepository();

const usuarioService = new UsuarioService(usuarioRepository);
const compraService = new CompraService(compraRepository);
const reseniaService = new ReseniaService(reseniaRepository);
const mensajeService = new MensajeService(mensajeRepository);
const eventoService = new EventoService(eventoRepository);
const categoriaService = new CategoriaService(categoriaRepository);
const tipoEntradaService = new TipoEntradaService(tipoEntradaRepository);
const cambioEstadoCompraService = new CambioEstadoCompraService(
    cambioEstadoCompraRepository,
    compraRepository,
    usuarioRepository
);

const usuarioController = new UsuarioController(usuarioService);
const compraController = new CompraController(compraService);
const reseniaController = new ReseniaController(reseniaService);
const mensajeController = new MensajeController(mensajeService);
const eventoController = new EventoController(eventoService);
const categoriaController = new CategoriaController(categoriaService);
const tipoEntradaController = new TipoEntradaController(tipoEntradaService);
const cambioEstadoCompraController = new CambioEstadoCompraController(cambioEstadoCompraService);

const routes = Router();

routes.get('/health', getHealth);

routes.get('/CambioEstadoCompra', cambioEstadoCompraController.getAll);
routes.post('/CambioEstadoCompra', cambioEstadoCompraController.create);
routes.put('/CambioEstadoCompra/:id', cambioEstadoCompraController.update);
routes.patch('/CambioEstadoCompra/:id', cambioEstadoCompraController.path);
routes.delete('/CambioEstadoCompra/:id', cambioEstadoCompraController.delete);

routes.get('/Compra', compraController.getAll);
routes.post('/Compra', compraController.create);
routes.put('/Compra/:id', compraController.update);
routes.patch('/Compra/:id', compraController.path);
routes.delete('/Compra/:id', compraController.delete);

routes.get('/Resenia', reseniaController.getAll);
routes.post('/Resenia', reseniaController.create);
routes.put('/Resenia/:id', reseniaController.update);
routes.patch('/Resenia/:id', reseniaController.path);
routes.delete('/Resenia/:id', reseniaController.delete);

routes.get('/Usuario', usuarioController.getAll);
routes.post('/Usuario', usuarioController.create);
routes.put('/Usuario/:id', usuarioController.update);
routes.patch('/Usuario/:id', usuarioController.path);
routes.delete('/Usuario/:id', usuarioController.delete);

routes.get('/Mensaje', mensajeController.getAll);
routes.post('/Mensaje', mensajeController.create);
routes.put('/Mensaje/:id', mensajeController.update);
routes.patch('/Mensaje/:id', mensajeController.path);
routes.delete('/Mensaje/:id', mensajeController.delete);

routes.get('/Evento', eventoController.getAll);
routes.post('/Evento', eventoController.create);
routes.put('/Evento/:id', eventoController.update);
routes.patch('/Evento/:id', eventoController.path);
routes.delete('/Evento/:id', eventoController.delete);

routes.get('/Categoria', categoriaController.getAll);
routes.post('/Categoria', categoriaController.create);
routes.put('/Categoria/:id', categoriaController.update);
routes.patch('/Categoria/:id', categoriaController.path);
routes.delete('/Categoria/:id', categoriaController.delete);

routes.get('/TipoEntrada', tipoEntradaController.getAll);
routes.post('/TipoEntrada', tipoEntradaController.create);
routes.put('/TipoEntrada/:id', tipoEntradaController.update);
routes.patch('/TipoEntrada/:id', tipoEntradaController.path);
routes.delete('/TipoEntrada/:id', tipoEntradaController.delete);

export default routes;
