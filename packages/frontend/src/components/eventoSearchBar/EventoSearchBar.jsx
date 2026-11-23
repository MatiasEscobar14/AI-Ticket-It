import "./EventoSearchBar.css";

const EventoSearchBar = ({
  categories,
  category,
  onCategoryChange,
  onQueryChange,
  onSortChange,
  query,
  sort,
}) => (
  <form
    className="event-filters"
    role="search"
    onSubmit={(event) => event.preventDefault()}
  >
    <div>
      <label htmlFor="event-query">¿Qué querés ver?</label>
      <input
        id="event-query"
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Ej.: música, teatro"
        autoComplete="off"
      />
    </div>
    <div>
      <label htmlFor="event-sort">Ordenar por</label>
      <select
        id="event-sort"
        value={sort}
        onChange={(event) => onSortChange(event.target.value)}
      >
        <option value="fecha">Fecha más próxima</option>
        <option value="precio">Precio más bajo</option>
        <option value="puntaje">Mejor puntaje del organizador</option>
      </select>
    </div>
    <div>
      <label htmlFor="event-category">Categoría</label>
      <select
        id="event-category"
        value={category}
        onChange={(event) => onCategoryChange(event.target.value)}
      >
        {categories.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </div>
  </form>
);

export default EventoSearchBar;
