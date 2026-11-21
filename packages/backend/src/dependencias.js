import CambioEstadoCompraRepository from './repositories/CambioEstadoCompraRepository.js';
import CompraRepository from './repositories/CompraRepository.js';
import ReseniaRepository from './repositories/ReseniaRepository.js';
import UsuarioRepository from './repositories/UsuarioRepository.js';
import MensajeRepository from './repositories/MensajeRepository.js';
import EventoRepository from './repositories/EventoRepository.js';
import CategoriaRepository from './repositories/CategoriaRepository.js';
import TipoEntradaRepository from './repositories/TipoEntradaRepository.js';

import CambioEstadoCompraService from './services/CambioEstadoCompraService.js';
import CompraService from './services/CompraService.js';
import ReseniaService from './services/ReseniaService.js';
import UsuarioService from './services/UsuarioService.js';
import MensajeService from './services/MensajeService.js';
import EventoService from './services/EventoService.js';
import CategoriaService from './services/CategoriaService.js';
import TipoEntradaService from './services/TipoEntradaService.js';

import CambioEstadoCompraController from './controllers/CambioEstadoCompraController.js';
import CompraController from './controllers/CompraController.js';
import ReseniaController from './controllers/ReseniaController.js';
import UsuarioController from './controllers/UsuarioController.js';
import MensajeController from './controllers/MensajeController.js';
import EventoController from './controllers/EventoController.js';
import CategoriaController from './controllers/CategoriaController.js';
import TipoEntradaController from './controllers/TipoEntradaController.js';

const usuarioRepository = new UsuarioRepository();
const compraRepository = new CompraRepository();
const reseniaRepository = new ReseniaRepository();
const mensajeRepository = new MensajeRepository();
const eventoRepository = new EventoRepository();
const categoriaRepository = new CategoriaRepository();
const cambioEstadoCompraRepository = new CambioEstadoCompraRepository();
const tipoEntradaRepository = new TipoEntradaRepository(eventoRepository);

const usuarioService = new UsuarioService(usuarioRepository);
const compraService = new CompraService(compraRepository, eventoRepository);
const reseniaService = new ReseniaService(reseniaRepository, compraRepository);
const mensajeService = new MensajeService(mensajeRepository);
const eventoService = new EventoService(eventoRepository);
const categoriaService = new CategoriaService(categoriaRepository);
const tipoEntradaService = new TipoEntradaService(tipoEntradaRepository, eventoRepository);
const cambioEstadoCompraService = new CambioEstadoCompraService(
    cambioEstadoCompraRepository,
    compraRepository,
    usuarioRepository
);

export const cambioEstadoCompraController = new CambioEstadoCompraController(cambioEstadoCompraService);
export const compraController = new CompraController(compraService);
export const reseniaController = new ReseniaController(reseniaService);
export const usuarioController = new UsuarioController(usuarioService);
export const mensajeController = new MensajeController(mensajeService);
export const eventoController = new EventoController(eventoService);
export const categoriaController = new CategoriaController(categoriaService);
export const tipoEntradaController = new TipoEntradaController(tipoEntradaService);
