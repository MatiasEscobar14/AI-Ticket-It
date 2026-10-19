import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import apiRoutes from './routes/index.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Middlewares
app.use(cors({
  origin: config.clientUrl,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a la API del Trabajo Práctico',
    endpoints: {
      health: '/api/health',
      items: '/api/items'
    }
  });
});

app.use('/api', apiRoutes);

// Manejo de errores y 404
app.use(notFound);
app.use(errorHandler);

export default app;
