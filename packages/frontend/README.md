# Módulo Frontend

Aplicación cliente desarrollada con **React** y construida con **Vite**.

## Estructura del Proyecto

```
frontend/
├── public/              # Archivos estáticos públicos
├── src/
│   ├── assets/          # Imágenes y recursos estáticos
│   ├── services/        # Clientes de API y peticiones HTTP
│   │   └── api.js       # Servicio configurado para conectar al backend
│   ├── App.css          # Estilos del componente principal
│   ├── App.jsx          # Componente principal con demo de conexión
│   ├── index.css        # Estilos globales
│   └── main.jsx         # Punto de entrada de React (DOM root)
├── .env.example         # Plantilla de variables de entorno (VITE_API_URL)
├── .env                 # Variables de entorno locales
├── index.html           # Documento HTML base
├── package.json         # Dependencias y scripts
├── vite.config.js       # Configuración de Vite
└── README.md
```

## Instalación y Ejecución

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Configurar variables de entorno (si es necesario):
   ```bash
   cp .env.example .env
   ```

3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   Por defecto se levantará en `http://localhost:5173`.

4. Compilar para producción:
   ```bash
   npm run build
   ```
