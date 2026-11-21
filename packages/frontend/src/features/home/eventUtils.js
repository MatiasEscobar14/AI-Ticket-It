export const formatMoney = (amount) =>
    Number(amount).toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0,
    });

export const formatDate = (date) =>
    new Date(date).toLocaleDateString('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

export const getOrganizerName = (organizer) =>
    [organizer?.nombre, organizer?.apellido].filter(Boolean).join(' ') || 'Organizador';

export const getMinimumPrice = (event) =>
    Math.min(...event.tiposEntrada.map((ticket) => Number(ticket.precio)));

export const getDaysUntil = (date) => {
    const today = new Date();
    const eventDate = new Date(date);
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    return Math.ceil((eventDate - today) / 86400000);
};
