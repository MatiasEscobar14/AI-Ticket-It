# Módulo Backend

Servidor API REST desarrollado con **Node.js** y **Express** utilizando ESModules (`import` / `export`).

## Estructura del Proyecto

```
backend/
├── src/
│   ├── config/          # Configuración y variables de entorno
│   ├── controllers/     # Controladores (lógica de negocio)
│   ├── middlewares/     # Middlewares (errores, 404, etc.)
│   ├── routes/          # Definición de rutas y endpoints
│   ├── app.js           # Configuración de Express y middlewares globales
│   └── index.js         # Punto de entrada / levantamiento del servidor
├── .env.example         # Plantilla de variables de entorno
├── .env                 # Variables de entorno locales
├── package.json         # Dependencias y scripts
└── README.md
```

## Endpoints Disponibles

- `GET /`: Bienvenida y mapa de rutas.
- `GET /api/health`: Estado del servidor.
- `GET /api/items`: Obtener lista de elementos de ejemplo.
- `GET /api/items/:id`: Obtener elemento por ID.
- `POST /api/items`: Crear nuevo elemento (`{ "title": "...", "description": "..." }`).
- `DELETE /api/items/:id`: Eliminar elemento por ID.

## Instalación y Ejecución

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Configurar variables de entorno (si es necesario):
   ```bash
   cp .env.example .env
   ```

3. Iniciar en modo desarrollo (con recarga automática):
   ```bash
   npm run dev
   ```

4. Iniciar en modo producción:
   ```bash
   npm start
   ```
