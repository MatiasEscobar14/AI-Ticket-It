import { useEffect, useState } from "react";
import "./EventoCarousel.css";
import CarouselItem from "../eventoItem/Carouseltem";

const getVisibleCount = () => {
  if (window.innerWidth <= 630) return 1;
  if (window.innerWidth <= 900) return 2;
  return 3;
};

export default function EventoCarousel({ eventos, onOpen }) {
  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(getVisibleCount);

  useEffect(() => {
    const updateVisibleCount = () => {
      const nextCount = getVisibleCount();
      setVisibleCount((currentCount) => (
        currentCount === nextCount ? currentCount : nextCount
      ));
    };
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  useEffect(() => {
    setIndex(0);
  }, [eventos, visibleCount]);

  if (!Array.isArray(eventos) || eventos.length === 0) {
    return <p className="carousel-empty">No hay eventos disponibles</p>;
  }

  const ultimoIndice = Math.max(0, eventos.length - visibleCount);
  const puedeRetroceder = index > 0;
  const puedeAvanzar = index < ultimoIndice;

  const retroceder = () => {
    if (puedeRetroceder) setIndex((indiceActual) => indiceActual - 1);
  };

  const avanzar = () => {
    if (puedeAvanzar) setIndex((indiceActual) => indiceActual + 1);
  };

  const desplazamiento = `translateX(-${index * (100 / visibleCount)}%)`;

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
              <CarouselItem
                evento={evento}
                key={evento.id}
                onOpen={() => onOpen(evento.id)}
              />
            ))}
          </div>
        </div>
        <div className="carousel-controls">
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
    </div>
  );
}
