const eventos = [
  {
    id: 1,
    nombre: "Noche de Jazz",
    descripcion: "Una noche de música en vivo con artistas locales.",
    categoria: { nombre: "Música", descripcion: "Conciertos y espectáculos musicales." },
    fecha: "2027-03-20T21:00:00.000Z",
    multimedia: [],
    organizador: { nombre: "Sala", apellido: "Central" },
    tiposEntrada: [
      {
        nombre: "General",
        descripcion: "Acceso al salón principal.",
        precio: 8000,
        cupo: 120,
      },
    ],
  },
  {
    id: 2,
    nombre: "Festival de Teatro",
    descripcion: "Obras breves y propuestas de compañías independientes.",
    categoria: { nombre: "Teatro", descripcion: "Obras y espectáculos teatrales." },
    fecha: "2027-04-10T19:30:00.000Z",
    multimedia: [],
    organizador: { nombre: "Espacio", apellido: "Cultural" },
    tiposEntrada: [
      {
        nombre: "General",
        descripcion: "Acceso a la función.",
        precio: 6500,
        cupo: 80,
      },
      {
        nombre: "Estudiante",
        descripcion: "Entrada con descuento para estudiantes.",
        precio: 4500,
        cupo: 40,
      },
    ],
  },
  {
    id: 3,
    nombre: "Feria de Emprendedores",
    descripcion: "Un encuentro para descubrir proyectos y productos locales.",
    categoria: { nombre: "Ferias", descripcion: "Ferias, exposiciones y encuentros." },
    fecha: "2027-05-02T14:00:00.000Z",
    multimedia: [],
    organizador: { nombre: "Comunidad", apellido: "Creativa" },
    tiposEntrada: [
      {
        nombre: "Acceso general",
        descripcion: "Acceso a la feria durante el día.",
        precio: 1500,
        cupo: 300,
      },
    ],
  },
  {
    id: 4,
    nombre: "Taller de Fotografía",
    descripcion: "Taller práctico de composición y fotografía urbana.",
    categoria: { nombre: "Talleres", descripcion: "Actividades prácticas y educativas." },
    fecha: "2027-05-15T10:00:00.000Z",
    multimedia: [],
    organizador: { nombre: "Estudio", apellido: "Luz" },
    tiposEntrada: [
      {
        nombre: "Cupo individual",
        descripcion: "Incluye acceso al taller y materiales.",
        precio: 12000,
        cupo: 25,
      },
    ],
  },
  {
    id: 5,
    nombre: "Ciclo de Cine al Aire Libre",
    descripcion: "Una función para disfrutar cine bajo las estrellas.",
    categoria: { nombre: "Cine", descripcion: "Proyecciones y encuentros de cine." },
    fecha: "2027-06-05T20:00:00.000Z",
    multimedia: [],
    organizador: { nombre: "Cine", apellido: "Abierto" },
    tiposEntrada: [
      {
        nombre: "General",
        descripcion: "Acceso a la función.",
        precio: 3500,
        cupo: 200,
      },
    ],
  },
  {
    id: 6,
    nombre: "Encuentro de Cocina",
    descripcion: "Demostraciones y degustaciones de cocina regional.",
    categoria: { nombre: "Gastronomía", descripcion: "Experiencias y eventos gastronómicos." },
    fecha: "2027-06-19T12:00:00.000Z",
    multimedia: [],
    organizador: { nombre: "Sabores", apellido: "Locales" },
    tiposEntrada: [
      {
        nombre: "General",
        descripcion: "Incluye acceso y degustación.",
        precio: 9000,
        cupo: 100,
      },
    ],
  },
  {
    id: 7,
    nombre: "Concierto Acústico",
    descripcion: "Presentación íntima de cantautores de la región.",
    categoria: { nombre: "Música", descripcion: "Conciertos y espectáculos musicales." },
    fecha: "2027-07-03T20:30:00.000Z",
    multimedia: [],
    organizador: { nombre: "Club", apellido: "Acústico" },
    tiposEntrada: [
      {
        nombre: "General",
        descripcion: "Acceso al concierto.",
        precio: 7000,
        cupo: 90,
      },
    ],
  },
  {
    id: 8,
    nombre: "Jornada de Diseño",
    descripcion: "Charlas y actividades sobre diseño y creatividad.",
    categoria: { nombre: "Diseño", descripcion: "Encuentros de diseño y creatividad." },
    fecha: "2027-07-24T09:00:00.000Z",
    multimedia: [],
    organizador: { nombre: "Diseño", apellido: "Abierto" },
    tiposEntrada: [
      {
        nombre: "General",
        descripcion: "Acceso a las charlas y actividades.",
        precio: 5000,
        cupo: 150,
      },
    ],
  },
];

async function obtenerEventos() {
  return eventos;
}

async function obtenerEventoPorId(id) {
  return eventos.find((evento) => String(evento.id) === String(id)) ?? null;
}

export { eventos, obtenerEventos, obtenerEventoPorId };