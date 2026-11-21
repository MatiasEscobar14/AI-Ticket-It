import "./CarouselItem.css";

function formatearFecha(fecha) {
  const fechaEvento = new Date(fecha);

  if (Number.isNaN(fechaEvento.getTime())) {
    return "Fecha por confirmar";
  }

  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(fechaEvento);
}

export default function CarouselItem({ evento }) {
  const nombreCategoria =
    typeof evento.categoria === "string"
      ? evento.categoria
      : evento.categoria?.nombre;
  const precios = evento.tiposEntrada
    ?.map((tipoEntrada) => tipoEntrada.precio)
    .filter((precio) => Number.isFinite(precio));
  const precioMinimo = precios?.length ? Math.min(...precios) : null;

  return (
    <article className="evento-card">
      {evento.multimedia?.[0] && (
        <img
          className="evento-card-image"
          src={evento.multimedia[0]}
          alt={evento.nombre}
        />
      )}
      <div className="evento-card-content">
        {nombreCategoria && (
          <p className="evento-card-category">{nombreCategoria}</p>
        )}
        <h3 className="evento-card-title">{evento.nombre}</h3>
        <p className="evento-card-date">{formatearFecha(evento.fecha)}</p>
        <p className="evento-card-description">{evento.descripcion}</p>
        {precioMinimo !== null && (
          <p className="evento-card-price">
            Desde ${precioMinimo.toLocaleString("es-AR")}
          </p>
        )}
      </div>
    </article>
  );
}