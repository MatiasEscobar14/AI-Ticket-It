# Proyecto Trabajo Práctico (Fullstack)

Repositorio estructurado en 2 módulos independientes para el desarrollo del Trabajo Práctico: **Backend** (API REST con Node.js y Express) y **Frontend** (SPA con React y Vite).

---

## Estructura del Repositorio

```text
├── backend/                  # Servidor y API REST (Node.js + Express)
│   ├── src/
│   │   ├── config/           # Configuración y variables de entorno
│   │   ├── controllers/      # Controladores (lógica de negocio)
│   │   ├── middlewares/      # Middlewares (errores, 404, validaciones)
│   │   ├── routes/           # Definición de rutas y endpoints
│   │   ├── app.js            # Instancia y middlewares de Express
│   │   └── index.js          # Entrada del servidor
│   ├── .env.example          # Variables de entorno modelo
│   ├── .env                  # Variables locales
│   ├── package.json
│   └── README.md
│
├── frontend/                 # Aplicación cliente (React + Vite)
│   ├── src/
│   │   ├── assets/           # Recursos estáticos
│   │   ├── services/         # Llamadas a la API (`api.js`)
│   │   ├── App.jsx           # Componente principal interactivo
│   │   ├── App.css           # Estilos de la aplicación
│   │   └── main.jsx          # Montaje de React
│   ├── .env.example          # Variables de entorno modelo
│   ├── .env                  # Variables locales
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── .gitignore                # Reglas de exclusión de Git para ambos módulos
├── package.json              # Scripts raíz para facilitar la gestión
└── README.md                 # Documentación general del repositorio
```

---

## Requisitos Previos

- [Node.js](https://nodejs.org/) v18 o superior instalado.
- [Git](https://git-scm.com/) instalado.

---

## Inicio Rápido

### 1. Clonar el repositorio (si aplica) o ubicarse en la carpeta raíz

```bash
cd "Tp individual"
```

### 2. Instalar dependencias

Puedes instalar las dependencias de ambos módulos en un solo comando desde la raíz:

```bash
npm run install:all
```

*(O de forma individual ejecutando `npm install` dentro de `backend/` y `frontend/`)*.

---

### 3. Ejecutar los servicios

Abre dos terminales:

#### Terminal 1: Backend
```bash
npm run dev:backend
# o desde la carpeta backend:
# cd backend && npm run dev
```
> El servidor iniciará en: **http://localhost:4000**  
> Probar endpoint de salud: **http://localhost:4000/api/health**

#### Terminal 2: Frontend
```bash
npm run dev:frontend
# o desde la carpeta frontend:
# cd frontend && npm run dev
```
> La aplicación web iniciará en: **http://localhost:5173**

---

## Características Incluidas

- **CORS Configurado**: El backend ya está configurado para aceptar peticiones desde el frontend (`http://localhost:5173`).
- **ESModules**: Ambos módulos utilizan sintaxis moderna de JavaScript (`import` / `export`).
- **Demostración Funcional**: La pantalla de inicio del frontend incluye un verificador de conexión con el backend en tiempo real y un formulario funcional conectado a los endpoints `/api/items`.
- **Arquitectura Limpia**: Separación en capas (rutas, controladores, servicios y middlewares) para facilitar la escalabilidad del trabajo práctico.
