import { useState } from 'react';
import { formatDate, formatMoney, getOrganizerName } from '../eventUtils';

const EventoDetail = ({ event, reviews, onBack, onPurchase }) => {
    const [selectedTicketIndex, setSelectedTicketIndex] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const selectedTicket = selectedTicketIndex === null
        ? null
        : event.tiposEntrada[selectedTicketIndex];
    const maxQuantity = selectedTicket ? Math.min(selectedTicket.cupo, 10) : 0;

    const handlePurchase = () => {
        if (!selectedTicket || quantity > selectedTicket.cupo) return;
        onPurchase(event, selectedTicket, quantity);
    };

    return (
        <section aria-labelledby="h-detalle">
            <button type="button" className="button-secondary" onClick={onBack}>
                ← Volver a la búsqueda
            </button>
            <h1 id="h-detalle" className="section-title" tabIndex="-1">{event.nombre}</h1>
            <p className="event-detail-meta">
                <strong>Fecha:</strong> {formatDate(event.fecha)}{' '}
                <span aria-hidden="true">·</span>{' '}
                <strong>Lugar:</strong> {event.lugar || 'A confirmar'}{' '}
                <span aria-hidden="true">·</span>{' '}
                <strong>Organizador:</strong> {getOrganizerName(event.organizador)}
            </p>

            <fieldset className="event-card ticket-choice">
                <legend>1. Elegí el tipo de entrada</legend>
                {event.tiposEntrada.map((ticket, index) => (
                    <label className="ticket-option" key={`${ticket.nombre}-${index}`}>
                        <input
                            type="radio"
                            name="ticket-type"
                            value={index}
                            disabled={ticket.cupo <= 0}
                            checked={selectedTicketIndex === index}
                            onChange={() => {
                                setSelectedTicketIndex(index);
                                setQuantity(1);
                            }}
                        />
                        <span>
                            <strong>{ticket.nombre}</strong> · {formatMoney(ticket.precio)}
                            <span className="muted ticket-stock">
                                {ticket.cupo <= 0 ? 'Agotado' : `Quedan ${ticket.cupo} entradas`}
                            </span>
                        </span>
                    </label>
                ))}
            </fieldset>

            <div className="event-card purchase-box">
                <h2>2. Elegí la cantidad</h2>
                <div className="quantity-control">
                    <button
                        type="button"
                        className="button-secondary quantity-button"
                        aria-label="Quitar una entrada"
                        disabled={!selectedTicket || quantity <= 1}
                        onClick={() => setQuantity((current) => current - 1)}
                    >
                        −
                    </button>
                    <output aria-label="Cantidad de entradas" aria-live="polite">{quantity}</output>
                    <button
                        type="button"
                        className="button-secondary quantity-button"
                        aria-label="Sumar una entrada"
                        disabled={!selectedTicket || quantity >= maxQuantity}
                        onClick={() => setQuantity((current) => current + 1)}
                    >
                        +
                    </button>
                </div>
                <p className="muted" aria-live="polite">
                    {selectedTicket
                        ? `Podés llevar hasta ${maxQuantity} entradas.`
                        : 'Elegí primero un tipo de entrada.'}
                </p>
                <p className="event-price" aria-live="polite">
                    {selectedTicket ? `Total: ${formatMoney(selectedTicket.precio * quantity)}` : ''}
                </p>
                <button
                    type="button"
                    className="button-primary"
                    disabled={!selectedTicket}
                    onClick={handlePurchase}
                >
                    Confirmar compra
                </button>
            </div>

            <section className="reviews-section" aria-labelledby="reviews-title">
                <h2 id="reviews-title">Opiniones sobre {getOrganizerName(event.organizador)}</h2>
                {reviews.length ? (
                    <ul className="event-list">
                        {reviews.map((review) => (
                            <li className="event-card" key={review.id}>
                                <div>
                                    <p className="muted">Sobre: {review.eventoNombre}</p>
                                    <p className="review-score">{review.puntuacion} de 5 estrellas</p>
                                    <p>{review.detalle}</p>
                                </div>
                                <p className="muted">
                                    {review.comprador?.nombre || 'Comprador'}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="muted">Todavía no hay reseñas para este evento.</p>
                )}
            </section>
        </section>
    );
};

export default EventoDetail;
