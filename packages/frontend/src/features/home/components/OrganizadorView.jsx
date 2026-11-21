import { useState } from 'react';
import EstadoBadge from './EstadoBadge';
import { formatMoney } from '../eventUtils';

const emptyTicket = { nombre: '', descripcion: '', precio: '', cupo: '' };

const OrganizadorView = ({
    event,
    events,
    purchases,
    eventsById,
    categories,
    selectedEventId,
    onSelectEvent,
    onCreateEvent,
    onUpdateStatus,
    onChat,
}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [date, setDate] = useState('');
    const [tickets, setTickets] = useState([{ ...emptyTicket, nombre: 'General' }]);
    const [formError, setFormError] = useState('');
    const eventPurchases = event
        ? purchases.filter((purchase) => purchase.eventId === event.id)
        : [];

    const updateTicket = (index, field, value) => {
        setTickets((current) => current.map((ticket, ticketIndex) =>
            ticketIndex === index ? { ...ticket, [field]: value } : ticket
        ));
    };

    const createEvent = async (formEvent) => {
        formEvent.preventDefault();
        setFormError('');
        try {
            await onCreateEvent({
                nombre: name.trim(),
                descripcion: description.trim(),
                categoria: categoryId,
                fecha: new Date(date).toISOString(),
                tiposEntrada: tickets.map((ticket) => ({
                    nombre: ticket.nombre.trim(),
                    descripcion: ticket.descripcion.trim(),
                    precio: Number(ticket.precio),
                    cupo: Number(ticket.cupo),
                })),
            });
            setName('');
            setDescription('');
            setDate('');
            setTickets([{ ...emptyTicket, nombre: 'General' }]);
        } catch (error) {
            setFormError(error.message);
        }
    };

    const availableStatuses = (status) => {
        if (status === 'PENDIENTE') return ['PENDIENTE', 'CONFIRMADA'];
        if (status === 'CONFIRMADA') return ['CONFIRMADA', 'UTILIZADA'];
        return [status];
    };

    return (
        <section aria-labelledby="h-organizador">
            <h1 id="h-organizador" tabIndex="-1">Panel organizador</h1>

            <form className="event-create-form" onSubmit={createEvent}>
                <h2>Crear un evento</h2>
                <div className="event-filters">
                    <div>
                        <label htmlFor="new-event-name">Nombre del evento</label>
                        <input id="new-event-name" required value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="new-event-category">Categoría</label>
                        <select
                            id="new-event-category"
                            required
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            <option value="">Elegí una categoría</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="new-event-date">Fecha y hora</label>
                        <input
                            id="new-event-date"
                            type="datetime-local"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                </div>
                <label htmlFor="new-event-description">Descripción</label>
                <textarea
                    id="new-event-description"
                    required
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <h3>Tipos de entrada</h3>
                {tickets.map((ticket, index) => (
                    <fieldset className="ticket-editor" key={index}>
                        <legend>Tipo {index + 1}</legend>
                        <div className="event-filters">
                            <div>
                                <label htmlFor={`ticket-name-${index}`}>Nombre</label>
                                <input
                                    id={`ticket-name-${index}`}
                                    required
                                    value={ticket.nombre}
                                    onChange={(e) => updateTicket(index, 'nombre', e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor={`ticket-price-${index}`}>Precio</label>
                                <input
                                    id={`ticket-price-${index}`}
                                    type="number"
                                    min="0"
                                    required
                                    value={ticket.precio}
                                    onChange={(e) => updateTicket(index, 'precio', e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor={`ticket-quantity-${index}`}>Cupo</label>
                                <input
                                    id={`ticket-quantity-${index}`}
                                    type="number"
                                    min="0"
                                    step="1"
                                    required
                                    value={ticket.cupo}
                                    onChange={(e) => updateTicket(index, 'cupo', e.target.value)}
                                />
                            </div>
                        </div>
                        <label htmlFor={`ticket-description-${index}`}>Descripción de la entrada</label>
                        <input
                            id={`ticket-description-${index}`}
                            required
                            value={ticket.descripcion}
                            onChange={(e) => updateTicket(index, 'descripcion', e.target.value)}
                        />
                        {tickets.length > 1 && (
                            <button
                                type="button"
                                className="button-secondary"
                                onClick={() => setTickets((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                            >
                                Quitar tipo
                            </button>
                        )}
                    </fieldset>
                ))}
                <div className="form-actions">
                    <button
                        type="button"
                        className="button-secondary"
                        onClick={() => setTickets((current) => [...current, { ...emptyTicket }])}
                    >
                        Agregar tipo de entrada
                    </button>
                    <button type="submit" className="button-primary">Publicar evento</button>
                </div>
                {formError && <p className="form-error" role="alert">{formError}</p>}
            </form>

            <h2 className="section-title">Gestionar evento</h2>
            <div className="event-filters">
                <div>
                    <label htmlFor="organizer-event">Seleccioná un evento</label>
                    <select
                        id="organizer-event"
                        value={selectedEventId}
                        disabled={events.length === 0}
                        onChange={(e) => onSelectEvent(e.target.value)}
                    >
                        {events.length === 0 && <option value="">Todavía no creaste eventos</option>}
                        {events.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}
                    </select>
                </div>
            </div>
            {event ? (
                <>
                    <h2 className="section-title">Entradas disponibles · {event.nombre}</h2>
                    <div className="table-scroll">
                        <table>
                            <caption className="sr-only">Cupo por tipo de entrada para {event.nombre}</caption>
                            <thead>
                                <tr><th scope="col">Tipo</th><th scope="col">Precio</th><th scope="col">Quedan</th></tr>
                            </thead>
                            <tbody>
                                {event.tiposEntrada.map((ticket) => (
                                    <tr key={ticket.id}>
                                        <th scope="row">{ticket.nombre}</th>
                                        <td>{formatMoney(ticket.precio)}</td>
                                        <td>{ticket.cupo <= 0 ? 'Agotado' : ticket.cupo}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <h2 className="section-title">Compras recibidas</h2>
                    <ul className="event-list">
                        {eventPurchases.map((purchase) => (
                            <li className="event-card" key={purchase.id}>
                                <div>
                                    <h3>Compra #{purchase.id.slice(-6)}</h3>
                                    <p>{purchase.cantidad} × {purchase.tipo}</p>
                                    <p className="muted">{eventsById[purchase.eventId]?.nombre}</p>
                                </div>
                                <div className="purchase-card-actions">
                                    <EstadoBadge status={purchase.estado} />
                                    <label htmlFor={`purchase-status-${purchase.id}`}>Estado de compra</label>
                                    <select
                                        id={`purchase-status-${purchase.id}`}
                                        value={purchase.estado}
                                        onChange={(e) => onUpdateStatus(purchase.id, e.target.value)}
                                    >
                                        {availableStatuses(purchase.estado).map((status) => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                    <button type="button" className="button-secondary" onClick={() => onChat(purchase.id)}>
                                        Responder mensajes ({purchase.mensajes.length})
                                    </button>
                                </div>
                            </li>
                        ))}
                        {eventPurchases.length === 0 && (
                            <li className="empty-notice">Todavía no hay compras para este evento.</li>
                        )}
                    </ul>
                </>
            ) : (
                <p className="empty-notice">
                    Todavía no creaste eventos. Publicá uno para empezar a gestionarlo.
                </p>
            )}
        </section>
    );
};

export default OrganizadorView;
