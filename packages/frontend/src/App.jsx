import { useState, useEffect } from 'react';
import { api } from './services/api';
import './App.css';

function App() {
  const [serverStatus, setServerStatus] = useState({ loading: true, online: false, data: null });
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Comprobar estado del backend
  const checkServer = async () => {
    try {
      setServerStatus({ loading: true, online: false, data: null });
      const data = await api.checkHealth();
      setServerStatus({ loading: false, online: true, data });
      setError(null);
    } catch (err) {
      setServerStatus({ loading: false, online: false, data: null });
      setError('No se pudo conectar con el backend. Asegúrate de que esté corriendo en el puerto 4000.');
    }
  };

  // Cargar lista de elementos
  const loadItems = async () => {
    try {
      const res = await api.getItems();
      if (res.success) {
        setItems(res.data);
      }
    } catch (err) {
      console.error('Error cargando elementos:', err);
    }
  };

  useEffect(() => {
    checkServer();
    loadItems();
  }, []);

  // Agregar nuevo elemento
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await api.createItem({ title, description });
      if (res.success) {
        setItems((prev) => [...prev, res.data]);
        setTitle('');
        setDescription('');
      }
    } catch (err) {
      alert('Error al agregar el elemento: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Eliminar elemento
  const handleDeleteItem = async (id) => {
    try {
      const res = await api.deleteItem(id);
      if (res.success) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Proyecto Trabajo Práctico</h1>
        <p className="subtitle">Estructura Fullstack: Express (Backend) + React Vite (Frontend)</p>
      </header>

      {/* Estado del servidor */}
      <section className="card status-card">
        <h2>Estado de Conexión</h2>
        <div className="status-indicator-container">
          <span className={`status-dot ${serverStatus.online ? 'online' : 'offline'}`}></span>
          <strong>
            {serverStatus.loading
              ? 'Verificando backend...'
              : serverStatus.online
              ? 'Backend Conectado (http://localhost:4000)'
              : 'Backend Desconectado'}
          </strong>
        </div>

        {error && <p className="error-message">{error}</p>}
        {serverStatus.data && (
          <div className="backend-info">
            <small>Uptime: {Math.round(serverStatus.data.uptime)}s | Timestamp: {serverStatus.data.timestamp}</small>
          </div>
        )}
        <button className="btn-secondary" onClick={() => { checkServer(); loadItems(); }}>
          Reintentar conexión
        </button>
      </section>

      {/* Módulo de Ejemplo CRUD */}
      <section className="card">
        <h2>Módulo de Ejemplo: Elementos</h2>
        <p className="helper-text">
          Este ejemplo interactúa con los endpoints <code>/api/items</code> del backend.
        </p>

        <form onSubmit={handleAddItem} className="form-item">
          <input
            type="text"
            placeholder="Título del elemento *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Descripción (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Agregar Elemento'}
          </button>
        </form>

        <div className="items-list">
          {items.length === 0 ? (
            <p className="empty-state">No hay elementos creados aún o el servidor está apagado.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="item-card">
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description || 'Sin descripción'}</p>
                </div>
                <button
                  className="btn-danger"
                  onClick={() => handleDeleteItem(item.id)}
                  title="Eliminar elemento"
                >
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
