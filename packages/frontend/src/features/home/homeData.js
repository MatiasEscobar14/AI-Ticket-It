const referenceId = (value) => String(value?._id ?? value?.id ?? value);

export const identifyRole = (nombre, apellido, organizer) =>
    organizer && nombre === organizer.nombre && apellido === organizer.apellido
        ? 'organizador'
        : 'comprador';

export const normalizeEvents = (rows, categories, users, reviews) => {
    const categoriesById = Object.fromEntries(categories.map((category) => [referenceId(category.id), category]));
    const usersById = Object.fromEntries(users.map((user) => [referenceId(user.id), user]));
    const eventsById = new Map(rows.map((event) => [referenceId(event.id), event]));
    const reviewsByOrganizer = new Map();
    const organizerScores = new Map();

    for (const review of reviews) {
        const event = eventsById.get(referenceId(review.evento));
        if (!event) continue;
        const owner = referenceId(event.organizador);
        const scores = organizerScores.get(owner) || [];
        scores.push(review.puntuacion);
        organizerScores.set(owner, scores);

        const organizerReviews = reviewsByOrganizer.get(owner) || [];
        organizerReviews.push({
            ...review,
            eventoNombre: event.nombre,
            comprador: usersById[referenceId(review.comprador)],
        });
        reviewsByOrganizer.set(owner, organizerReviews);
    }

    return rows.map((event) => {
        const owner = referenceId(event.organizador);
        const scores = organizerScores.get(owner) || [];

        return {
            ...event,
            categoria: categoriesById[referenceId(event.categoria)] || { nombre: 'Sin categoría' },
            organizador: usersById[owner] || {},
            tiposEntrada: event.tiposEntrada || [],
            resenias: reviewsByOrganizer.get(owner) || [],
            puntaje: scores.length
                ? scores.reduce((sum, score) => sum + score, 0) / scores.length
                : 0,
        };
    });
};
