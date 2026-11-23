const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  const body = response.status === 204 ? null : await response.json();
  if (!response.ok) {
    throw new Error(body?.message || 'Error al comunicarse con el servidor');
  }
  return body;
}

const jsonRequest = (method, data) => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});

export const api = {
  async checkHealth() {
    return request('/health');
  },

  async getEvents() {
    return request('/Evento');
  },

  async getCategories() {
    return request('/Categoria');
  },

  async getUsers() {
    return request('/Usuario');
  },

  async createUser(user) {
    return request('/Usuario', jsonRequest('POST', user));
  },

  async createCategory(category) {
    return request('/Categoria', jsonRequest('POST', category));
  },

  async createEvent(event) {
    return request('/Evento', jsonRequest('POST', event));
  },

  async updateEvent(id, event) {
    return request(`/Evento/${encodeURIComponent(id)}`, jsonRequest('PUT', event));
  },

  async deleteEvent(id) {
    return request(`/Evento/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },

  async createPurchase(purchase) {
    return request('/Compra', jsonRequest('POST', purchase));
  },

  async getPurchasesByBuyer(buyerId) {
    return request(`/Compra/comprador/${encodeURIComponent(buyerId)}`);
  },

  async getPurchasesByEvent(eventId) {
    return request(`/Compra/evento/${encodeURIComponent(eventId)}`);
  },

  async updatePurchase(id, changes) {
    return request(`/Compra/${encodeURIComponent(id)}`, jsonRequest('PATCH', changes));
  },

  async cancelPurchase(id) {
    return request(`/Compra/${encodeURIComponent(id)}/cancelar`, { method: 'POST' });
  },

  async getReviews() {
    return request('/Resenia');
  },

  async createReview(review) {
    return request('/Resenia', jsonRequest('POST', review));
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
