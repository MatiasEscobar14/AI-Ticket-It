const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const api = {
  async checkHealth() {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) throw new Error('Error al conectar con el servidor');
    return response.json();
  },

  async getItems() {
    const response = await fetch(`${API_BASE_URL}/items`);
    if (!response.ok) throw new Error('Error al obtener elementos');
    return response.json();
  },

  async createItem(itemData) {
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(itemData)
    });
    if (!response.ok) throw new Error('Error al crear elemento');
    return response.json();
  },

  async deleteItem(id) {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar elemento');
    return response.json();
  }
};
