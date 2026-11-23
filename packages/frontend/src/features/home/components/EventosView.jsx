import { useMemo, useState } from 'react';
import { getMinimumPrice, getOrganizerName } from '../eventUtils';
import EventoSearchBar from '../../../components/eventoSearchBar/EventoSearchBar';
import EventoCarousel from '../../../components/eventosCarrusel/EventoCarousel';

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
            <EventoSearchBar
                categories={categories}
                category={category}
                onCategoryChange={setCategory}
                onQueryChange={setQuery}
                onSortChange={setSort}
                query={query}
                sort={sort}
            />

            <p className="muted results-count" aria-live="polite">
                {filteredEvents.length} {filteredEvents.length === 1 ? 'evento encontrado' : 'eventos encontrados'}
            </p>
            <EventoCarousel eventos={filteredEvents} onOpen={onOpen} />
        </section>
    );
};

export default EventosView;
