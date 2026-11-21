import { useState } from 'react';
import EstadoBadge from './EstadoBadge';
import { formatDate, formatMoney, getDaysUntil } from '../eventUtils';

const ComprasView = ({ purchases, eventsById, reviewedEvents, onChat, onCancel, onReview }) => {
    const [reviewingId, setReviewingId] = useState(null);
    const [score, setScore] = useState('5');
    const [detail, setDetail] = useState('');

    const submitReview = (event, purchase) => {
        event.preventDefault();
        const text = detail.trim();
        if (!text) return;
        onReview(purchase, Number(score), text);
        setReviewingId(null);
        setDetail('');
        setScore('5');
    };

    return (
    <section aria-labelledby="h-compras">
        <h1 id="h-compras" tabIndex="-1">Mis compras</h1>
        <p className="muted">
            Cada estado tiene un nombre e ícono, para que no dependas solo del color.
        </p>
        <ul className="event-list">
            {purchases.map((purchase) => {
                const event = eventsById[purchase.eventId];
                const daysToEvent = getDaysUntil(event.fecha);
                const canCancel = !['UTILIZADA', 'CANCELADA', 'REEMBOLSADA'].includes(purchase.estado)
                    && new Date(event.fecha).getTime() > Date.now();

                return (
                    <li className="event-card" key={purchase.id}>
                        <div className="purchase-card-content">
                            <h2>{event.nombre}</h2>
                            <div className="event-meta">
                                <span><strong>Entradas:</strong> {purchase.cantidad} × {purchase.tipo}</span>
                                <span><strong>Total:</strong> {formatMoney(purchase.total)}</span>
                                <span><strong>Fecha:</strong> {formatDate(event.fecha)}</span>
                            </div>
                            {purchase.estado === 'CONFIRMADA' && (
                                <>
                                    <p className="countdown">
                                        {daysToEvent === 0 ? '¡Es hoy!' : daysToEvent === 1
                                            ? 'Falta 1 día'
                                            : `Faltan ${daysToEvent} días`}
                                    </p>
                                    <p className="muted">
                                        Podrás dejar una reseña cuando el organizador marque la entrada como utilizada.
                                    </p>
                                </>
                            )}
                            {purchase.estado === 'UTILIZADA' && (
                                reviewedEvents.has(purchase.eventId) ? (
                                    <p className="muted">Ya dejaste una reseña para este evento.</p>
                                ) : reviewingId === purchase.id ? (
                                    <form className="review-form" onSubmit={(eventChange) => submitReview(eventChange, purchase)}>
                                        <label htmlFor={`review-score-${purchase.id}`}>Puntaje</label>
                                        <select
                                            id={`review-score-${purchase.id}`}
                                            value={score}
                                            onChange={(eventChange) => setScore(eventChange.target.value)}
                                        >
                                            {[5, 4, 3, 2, 1].map((value) => (
                                                <option key={value} value={value}>{value} de 5</option>
                                            ))}
                                        </select>
                                        <label htmlFor={`review-detail-${purchase.id}`}>Tu comentario</label>
                                        <textarea
                                            id={`review-detail-${purchase.id}`}
                                            required
                                            value={detail}
                                            onChange={(eventChange) => setDetail(eventChange.target.value)}
                                            rows="3"
                                        />
                                        <button type="submit" className="button-primary">Publicar reseña</button>
                                        <button
                                            type="button"
                                            className="button-secondary"
                                            onClick={() => setReviewingId(null)}
                                        >
                                            Cancelar
                                        </button>
                                    </form>
                                ) : (
                                    <button
                                        type="button"
                                        className="button-secondary"
                                        onClick={() => setReviewingId(purchase.id)}
                                    >
                                        Dejar reseña
                                    </button>
                                )
                            )}
                        </div>
                        <div className="purchase-card-actions">
                            <EstadoBadge status={purchase.estado} />
                            <button type="button" className="button-secondary" onClick={() => onChat(purchase.id)}>
                                Mensajes ({purchase.mensajes.length})
                            </button>
                            {canCancel && (
                                <button
                                    type="button"
                                    className="button-danger"
                                    onClick={() => onCancel(purchase.id)}
                                >
                                    Cancelar compra
                                </button>
                            )}
                        </div>
                    </li>
                );
            })}
            {purchases.length === 0 && (
                <li className="empty-notice">Todavía no tenés compras.</li>
            )}
        </ul>
    </section>
    );
};

export default ComprasView;
