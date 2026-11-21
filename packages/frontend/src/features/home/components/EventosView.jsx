import { useMemo, useState } from 'react';
import { formatDate, formatMoney, getMinimumPrice, getOrganizerName } from '../eventUtils';

const EventosView = ({ events, onOpen }) => {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('Todas');
    const [sort, setSort] = useState('fecha');

    const categories = useMemo(
        () => ['Todas', ...new Set(events.map((event) => event.categoria?.nombre).filter(Boolean))],
        [events]
    );

    const filteredEvents = useMemo(() => {
        const normalizedQuery = query.trim().toLocaleLowerCase('es');
        const matches = events.filter((event) => {
            const matchesCategory = category === 'Todas' || event.categoria?.nombre === category;
            const searchable = [
                event.nombre,
                event.categoria?.nombre,
                event.lugar,
                getOrganizerName(event.organizador),
            ].join(' ').toLocaleLowerCase('es');

            return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
        });

        return matches.sort((first, second) => {
            if (sort === 'precio') return getMinimumPrice(first) - getMinimumPrice(second);
            if (sort === 'puntaje') return (second.puntaje || 0) - (first.puntaje || 0);
            return new Date(first.fecha) - new Date(second.fecha);
        });
    }, [category, events, query, sort]);

    return (
        <section aria-labelledby="h-buscar">
            <h1 id="h-buscar" tabIndex="-1">Buscar eventos</h1>
            <form className="event-filters" role="search" onSubmit={(event) => event.preventDefault()}>
                <div>
                    <label htmlFor="event-query">¿Qué querés ver?</label>
                    <input
                        id="event-query"
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Ej.: música, teatro"
                        autoComplete="off"
                    />
                </div>
                <div>
                    <label htmlFor="event-sort">Ordenar por</label>
                    <select id="event-sort" value={sort} onChange={(event) => setSort(event.target.value)}>
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
                        onChange={(event) => setCategory(event.target.value)}
                    >
                        {categories.map((item) => <option key={item}>{item}</option>)}
                    </select>
                </div>
            </form>

            <p className="muted results-count" aria-live="polite">
                {filteredEvents.length} {filteredEvents.length === 1 ? 'evento encontrado' : 'eventos encontrados'}
            </p>
            <ul className="event-list">
                {filteredEvents.map((event) => (
                    <li className="event-card" key={event.id}>
                        <div className="event-card-content">
                            <h2>{event.nombre}</h2>
                            <div className="event-meta">
                                <span><strong>Fecha:</strong> {formatDate(event.fecha)}</span>
                                <span><strong>Lugar:</strong> {event.lugar || 'A confirmar'}</span>
                                <span><strong>Categoría:</strong> {event.categoria?.nombre || 'Sin categoría'}</span>
                                <span><strong>Organizador:</strong> {getOrganizerName(event.organizador)}</span>
                            </div>
                        </div>
                        <div className="event-card-action">
                            <span className="muted">Desde</span>
                            <strong className="event-price">
                                {event.tiposEntrada.length ? formatMoney(getMinimumPrice(event)) : 'Sin entradas'}
                            </strong>
                            {event.puntaje > 0 && (
                                <span aria-label={`Puntaje promedio ${event.puntaje.toFixed(1)} de 5`}>
                                    ★ {event.puntaje.toFixed(1)}
                                </span>
                            )}
                            <button
                                type="button"
                                className="button-primary"
                                onClick={() => onOpen(event.id)}
                                aria-label={`Ver entradas de ${event.nombre}`}
                            >
                                Ver entradas
                            </button>
                        </div>
                    </li>
                ))}
                {filteredEvents.length === 0 && (
                    <li className="empty-notice">
                        No encontramos eventos. Probá con otra palabra o elegí otra categoría.
                    </li>
                )}
            </ul>
        </section>
    );
};

export default EventosView;
