let items = [
  { id: 1, title: 'Item de ejemplo 1', description: 'Primer elemento inicial' },
  { id: 2, title: 'Item de ejemplo 2', description: 'Segundo elemento inicial' }
];

export const getItems = (req, res) => {
  res.json({
    success: true,
    data: items
  });
};

export const getItemById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const item = items.find((i) => i.id === id);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: `Elemento con id ${id} no encontrado`
    });
  }

  res.json({
    success: true,
    data: item
  });
};

export const createItem = (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({
      success: false,
      message: 'El campo "title" es requerido'
    });
  }

  const newItem = {
    id: items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1,
    title,
    description: description || ''
  };

  items.push(newItem);

  res.status(201).json({
    success: true,
    message: 'Elemento creado exitosamente',
    data: newItem
  });
};

export const deleteItem = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const exists = items.some((i) => i.id === id);

  if (!exists) {
    return res.status(404).json({
      success: false,
      message: `Elemento con id ${id} no encontrado`
    });
  }

  items = items.filter((i) => i.id !== id);

  res.json({
    success: true,
    message: 'Elemento eliminado exitosamente'
  });
};
