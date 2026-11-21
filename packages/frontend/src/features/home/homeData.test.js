import { identifyRole, normalizeEvents } from './homeData';

test.each([
    ['Matias Escobar', 'Demo', 'organizador'],
    ['Matias', 'Demo', 'comprador'],
    ['Matias Escobar', 'demo', 'comprador'],
])('identifies %s %s as %s using an exact organizer-name match', (nombre, apellido, expectedRole) => {
    expect(identifyRole(nombre, apellido, { nombre: 'Matias Escobar', apellido: 'Demo' }))
        .toBe(expectedRole);
});

test('shows reviews from previous events by the same organizer', () => {
    const organizer = { id: 'organizer-1', nombre: 'Ana', apellido: 'Organizadora' };
    const buyer = { id: 'buyer-1', nombre: 'Luis', apellido: 'Comprador' };
    const category = { id: 'category-1', nombre: 'Música' };
    const events = [
        {
            id: 'past-event',
            nombre: 'Evento anterior',
            categoria: category.id,
            organizador: organizer.id,
            tiposEntrada: [],
        },
        {
            id: 'upcoming-event',
            nombre: 'Próximo evento',
            categoria: category.id,
            organizador: organizer.id,
        },
        {
            id: 'unrelated-event',
            nombre: 'Evento de otra persona',
            categoria: category.id,
            organizador: 'organizer-2',
        },
    ];
    const reviews = [{
        id: 'review-1',
        evento: 'past-event',
        comprador: buyer.id,
        puntuacion: 4,
        detalle: 'Muy bueno',
    }];

    const [pastEvent, upcomingEvent, unrelatedEvent] = normalizeEvents(
        events,
        [category],
        [organizer, buyer],
        reviews
    );

    expect(upcomingEvent.resenias).toEqual([{
        ...reviews[0],
        eventoNombre: 'Evento anterior',
        comprador: buyer,
    }]);
    expect(upcomingEvent.puntaje).toBe(4);
    expect(pastEvent.resenias).toEqual(upcomingEvent.resenias);
    expect(unrelatedEvent.resenias).toEqual([]);
    expect(unrelatedEvent.puntaje).toBe(0);
});
