import app from './app.js';
import { config } from './config/index.js';

app.listen(config.port, () => {
  console.log(` Servidor backend escuchando en http://localhost:${config.port}`);
  console.log(` Modo: ${config.nodeEnv}`);
});
