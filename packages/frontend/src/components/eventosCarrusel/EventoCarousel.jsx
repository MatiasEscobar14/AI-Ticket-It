import { useState } from "react";
import "./EventoCarousel.css";
import { eventos } from "../../mockdata/Eventos";
import CarouselItem from "../eventoItem/Carouseltem";

const VISIBLES = 3;

export default function EventoCarousel() {
  const [index, setIndex] = useState(0);

  if (!Array.isArray(eventos) || eventos.length === 0) {
    return <p className="carousel-empty">No hay eventos disponibles</p>;
  }

  const ultimoIndice = Math.max(0, eventos.length - VISIBLES);
  const puedeRetroceder = index > 0;
  const puedeAvanzar = index < ultimoIndice;

  const retroceder = () => {
    if (puedeRetroceder) setIndex((indiceActual) => indiceActual - 1);
  };

  const avanzar = () => {
    if (puedeAvanzar) setIndex((indiceActual) => indiceActual + 1);
  };

  const desplazamiento = `translateX(-${index * (100 / VISIBLES)}%)`;

  return (
    <div className="carousel-container">
      <h2 className="carousel-title">Próximos eventos</h2>
      <div className="carousel-wrapper">
        <div className="carousel-viewport">
          <div
            className="carousel-track"
            style={{ transform: desplazamiento }}
          >
            {eventos.map((evento) => (
              <CarouselItem evento={evento} key={evento.id} />
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={retroceder}
          disabled={!puedeRetroceder}
          className="carousel-btn left-btn"
          aria-label="Ver eventos anteriores"
        >
          {"<"}
        </button>
        <button
          type="button"
          onClick={avanzar}
          disabled={!puedeAvanzar}
          className="carousel-btn right-btn"
          aria-label="Ver eventos siguientes"
        >
          {">"}
        </button>
      </div>
    </div>
  );
}
