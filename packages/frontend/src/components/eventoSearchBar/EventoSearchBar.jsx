import "./EventoSearchBar.css";
import { FaSearch, FaTicketAlt } from "react-icons/fa";

const EventoSearchBar = () => {
  return (
    <section className="evento-search" aria-labelledby="evento-search-title">
      <div className="evento-search-heading">
        <span className="evento-search-icon" aria-hidden="true">
          <FaTicketAlt />
        </span>
        <div>
          <h1 id="evento-search-title">Encontrá tu próximo evento</h1>
          <p>Experiencias únicas, a un solo lugar.</p>
        </div>
      </div>
      <div className="evento-search-controls">
        <label className="search-field">
          <span className="field-label">¿Qué evento estás buscando?</span>
          <span className="search-input-wrapper">
            <FaSearch className="search-input-icon" aria-hidden="true" />
            <input
              type="search"
              className="search-input"
              placeholder="Ej.: música, teatro, ferias..."
            />
          </span>
        </label>
        <button type="button" className="search-button">
          <FaSearch aria-hidden="true" />
          <span>Buscar</span>
        </button>
      </div>
    </section>
  );
};

export default EventoSearchBar;
