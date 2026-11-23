import { useState } from 'react';
import EstadoBadge from './EstadoBadge';
import { formatMoney } from '../eventUtils';

const emptyTicket = { nombre: '', descripcion: '', precio: '', cupo: '' };

const toDateTimeLocal = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
};

const sanitizePrice = (value) => {
    const numericValue = value.replace(',', '.').replace(/[^\d.]/g, '');
    const decimalIndex = numericValue.indexOf('.');
    if (decimalIndex === -1) return numericValue;
    return `${numericValue.slice(0, decimalIndex)}.${numericValue.slice(decimalIndex + 1).replace(/\./g, '')}`;
};

const validateEventForm = ({ name, description, categoryId, date, tickets }) => {
    const errors = {};
    if (!name.trim()) errors.name = '⚠️ Completá el nombre del evento.';
    if (!categoryId) errors.categoryId = '⚠️ Seleccioná una categoría.';
    if (!date) errors.date = '⚠️ Completá la fecha y hora.';
    if (!description.trim()) errors.description = '⚠️ Completá la descripción.';

    tickets.forEach((ticket, index) => {
        const prefix = `ticket-${index}`;
        if (!ticket.nombre.trim()) errors[`${prefix}-name`] = '⚠️ Completá el nombre del tipo de entrada.';
        if (!ticket.precio.trim()) {
            errors[`${prefix}-price`] = '⚠️ Completá el precio.';
        } else if (!Number.isFinite(Number(ticket.precio))) {
            errors[`${prefix}-price`] = '⚠️ Ingresá un precio válido usando solo números.';
        }
        if (!ticket.cupo.trim()) {
            errors[`${prefix}-quantity`] = '⚠️ Completá el cupo.';
        } else if (!/^\d+$/.test(ticket.cupo)) {
            errors[`${prefix}-quantity`] = '⚠️ El cupo debe contener solo números enteros.';
        }
        if (!ticket.descripcion.trim()) {
            errors[`${prefix}-description`] = '⚠️ Completá la descripción de la entrada.';
        }
    });

    return errors;
};

const OrganizadorView = ({
    event,
    events,
    purchases,
    eventsById,
    categories,
    selectedEventId,
    onSelectEvent,
    onCreateEvent,
    onUpdateEvent,
    onDeleteEvent,
    onUpdateStatus,
    onChat,
}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [date, setDate] = useState('');
    const [tickets, setTickets] = useState([{ ...emptyTicket, nombre: 'General' }]);
    const [editingEventId, setEditingEventId] = useState(null);
    const [formError, setFormError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const eventPurchases = event
        ? purchases.filter((purchase) => purchase.eventId === event.id)
        : [];

    const clearFieldError = (field) => {
        setFieldErrors((current) => {
            if (!current[field]) return current;
            const next = { ...current };
            delete next[field];
            return next;
        });
    };

    const updateField = (field, setter, value) => {
        setter(value);
        clearFieldError(field);
    };

    const updateTicket = (index, field, value) => {
        setTickets((current) => current.map((ticket, ticketIndex) =>
            ticketIndex === index ? { ...ticket, [field]: value } : ticket
        ));
        clearFieldError(`ticket-${index}-${{
            nombre: 'name',
            precio: 'price',
            cupo: 'quantity',
            descripcion: 'description',
        }[field]}`);
    };

    const resetEventForm = () => {
        setEditingEventId(null);
        setName('');
        setDescription('');
        setCategoryId('');
        setDate('');
        setTickets([{ ...emptyTicket, nombre: 'General' }]);
        setFormError('');
        setFieldErrors({});
    };

    const startEditingEvent = () => {
        setEditingEventId(event.id);
        setName(event.nombre);
        setDescription(event.descripcion);
        setCategoryId(event.categoria?.id ?? event.categoria?._id ?? event.categoria ?? '');
        setDate(toDateTimeLocal(event.fecha));
        setTickets((event.tiposEntrada || []).map((ticket) => ({
            ...ticket,
            precio: String(ticket.precio),
            cupo: String(ticket.cupo),
        })));
        setFormError('');
        setFieldErrors({});
    };

    const eventFormData = () => ({
        nombre: name.trim(),
        descripcion: description.trim(),
        categoria: categoryId,
        fecha: new Date(date).toISOString(),
        tiposEntrada: tickets.map((ticket) => ({
            ...(ticket.id ? { id: ticket.id } : {}),
            nombre: ticket.nombre.trim(),
            descripcion: ticket.descripcion.trim(),
            precio: Number(ticket.precio),
            cupo: Number(ticket.cupo),
        })),
    });

    const saveEvent = async (formEvent) => {
        formEvent.preventDefault();
        setFormError('');
        const validationErrors = validateEventForm({
            name,
            description,
            categoryId,
            date,
            tickets,
        });
        setFieldErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        try {
            if (editingEventId) {
                await onUpdateEvent(editingEventId, eventFormData());
            } else {
                await onCreateEvent(eventFormData());
            }
            resetEventForm();
        } catch (error) {
            setFormError(error.message);
        }
    };

    const ticketHasPurchases = (ticket) => ticket.id && eventPurchases.some((purchase) => {
        const ticketId = purchase.tipoEntrada?._id
            ?? purchase.tipoEntrada?.id
            ?? purchase.tipoEntrada;
        return String(ticketId) === String(ticket.id);
    });

    const deleteEvent = async () => {
        if (eventPurchases.length > 0) {
            setFormError('No se puede eliminar un evento con compras asociadas.');
            return;
        }
        if (!window.confirm(`¿Eliminar el evento "${event.nombre}"? Esta acción no se puede deshacer.`)) return;

        setFormError('');
        try {
            await onDeleteEvent(event.id);
            resetEventForm();
        } catch (error) {
            setFormError(error.message);
        }
    };

    const availableStatuses = (status) => {
        if (status === 'PENDIENTE') return ['PENDIENTE', 'CONFIRMADA'];
        if (status === 'CONFIRMADA') return ['CONFIRMADA', 'UTILIZADA'];
        return [status];
    };

    const fieldError = (field) => fieldErrors[field] && (
        <p id={`${field}-error`} className="field-error" role="alert">
            {fieldErrors[field]}
        </p>
    );

    return (
        <section aria-labelledby="h-organizador">
            <h1 id="h-organizador" tabIndex="-1">Panel organizador</h1>

            <form className="event-create-form" noValidate onSubmit={saveEvent}>
                <h2>{editingEventId ? `Editar evento: ${name}` : 'Crear un evento'}</h2>
                <div className="event-filters">
                    <div>
                        <label htmlFor="new-event-name">Nombre del evento</label>
                        <input
                            id="new-event-name"
                            required
                            aria-invalid={Boolean(fieldErrors.name)}
                            aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                            value={name}
                            onChange={(e) => updateField('name', setName, e.target.value)}
                        />
                        {fieldError('name')}
                    </div>
                    <div>
                        <label htmlFor="new-event-category">Categoría</label>
                        <select
                            id="new-event-category"
                            required
                            aria-invalid={Boolean(fieldErrors.categoryId)}
                            aria-describedby={fieldErrors.categoryId ? 'categoryId-error' : undefined}
                            value={categoryId}
                            onChange={(e) => updateField('categoryId', setCategoryId, e.target.value)}
                        >
                            <option value="">Elegí una categoría</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.nombre}</option>
                            ))}
                        </select>
                        {fieldError('categoryId')}
                    </div>
                    <div>
                        <label htmlFor="new-event-date">Fecha y hora</label>
                        <input
                            id="new-event-date"
                            type="datetime-local"
                            required
                            aria-invalid={Boolean(fieldErrors.date)}
                            aria-describedby={fieldErrors.date ? 'date-error' : undefined}
                            value={date}
                            onChange={(e) => updateField('date', setDate, e.target.value)}
                        />
                        {fieldError('date')}
                    </div>
                </div>
                <div className="event-description-field">
                    <label htmlFor="new-event-description">Descripción</label>
                    <textarea
                        id="new-event-description"
                        required
                        rows="4"
                        aria-invalid={Boolean(fieldErrors.description)}
                        aria-describedby={fieldErrors.description ? 'description-error' : undefined}
                        value={description}
                        onChange={(e) => updateField('description', setDescription, e.target.value)}
                    />
                    {fieldError('description')}
                </div>
                <h3>Tipos de entrada</h3>
                {tickets.map((ticket, index) => (
                    <fieldset className="ticket-editor" key={ticket.id || index}>
                        <legend>Tipo {index + 1}</legend>
                        <div className="event-filters">
                            <div>
                                <label htmlFor={`ticket-name-${index}`}>Nombre</label>
                                <input
                                    id={`ticket-name-${index}`}
                                    required
                                    aria-invalid={Boolean(fieldErrors[`ticket-${index}-name`])}
                                    aria-describedby={fieldErrors[`ticket-${index}-name`] ? `ticket-${index}-name-error` : undefined}
                                    value={ticket.nombre}
                                    onChange={(e) => updateTicket(index, 'nombre', e.target.value)}
                                />
                                {fieldError(`ticket-${index}-name`)}
                            </div>
                            <div>
                                <label htmlFor={`ticket-price-${index}`}>Precio</label>
                                <input
                                    id={`ticket-price-${index}`}
                                    type="text"
                                    inputMode="decimal"
                                    required
                                    aria-invalid={Boolean(fieldErrors[`ticket-${index}-price`])}
                                    aria-describedby={fieldErrors[`ticket-${index}-price`] ? `ticket-${index}-price-error` : undefined}
                                    value={ticket.precio}
                                    onChange={(e) => updateTicket(index, 'precio', sanitizePrice(e.target.value))}
                                />
                                {fieldError(`ticket-${index}-price`)}
                            </div>
                            <div>
                                <label htmlFor={`ticket-quantity-${index}`}>Cupo</label>
                                <input
                                    id={`ticket-quantity-${index}`}
                                    type="text"
                                    inputMode="numeric"
                                    required
                                    aria-invalid={Boolean(fieldErrors[`ticket-${index}-quantity`])}
                                    aria-describedby={fieldErrors[`ticket-${index}-quantity`] ? `ticket-${index}-quantity-error` : undefined}
                                    value={ticket.cupo}
                                    onChange={(e) => updateTicket(index, 'cupo', e.target.value.replace(/\D/g, ''))}
                                />
                                {fieldError(`ticket-${index}-quantity`)}
                            </div>
                        </div>
                        <div className="ticket-description-field">
                            <label htmlFor={`ticket-description-${index}`}>Descripción de la entrada</label>
                            <input
                                id={`ticket-description-${index}`}
                                required
                                aria-invalid={Boolean(fieldErrors[`ticket-${index}-description`])}
                                aria-describedby={fieldErrors[`ticket-${index}-description`] ? `ticket-${index}-description-error` : undefined}
                                value={ticket.descripcion}
                                onChange={(e) => updateTicket(index, 'descripcion', e.target.value)}
                            />
                            {fieldError(`ticket-${index}-description`)}
                        </div>
                        {tickets.length > 1 && (
                            <button
                                type="button"
                                className="button-secondary"
                                disabled={Boolean(ticketHasPurchases(ticket))}
                                onClick={() => {
                                    setTickets((current) => current.filter((_, itemIndex) => itemIndex !== index));
                                    setFieldErrors({});
                                }}
                            >
                                {ticketHasPurchases(ticket) ? 'Entrada con compras' : 'Quitar tipo'}
                            </button>
                        )}
                    </fieldset>
                ))}
                <div className="form-actions">
                    <button
                        type="button"
                        className="button-secondary"
                        onClick={() => {
                            setTickets((current) => [...current, { ...emptyTicket }]);
                            setFieldErrors({});
                        }}
                    >
                        Agregar tipo de entrada
                    </button>
                    <button type="submit" className="button-primary">
                        {editingEventId ? 'Guardar cambios' : 'Publicar evento'}
                    </button>
                    {editingEventId && (
                        <button type="button" className="button-secondary" onClick={resetEventForm}>
                            Cancelar edición
                        </button>
                    )}
                </div>
                {formError && <p className="form-error" role="alert">⚠️ {formError}</p>}
            </form>

            <h2 className="section-title">Gestionar evento</h2>
            <div className="event-filters">
                <div>
                    <label htmlFor="organizer-event">Seleccioná un evento</label>
                    <select
                        id="organizer-event"
                        value={selectedEventId}
                        disabled={events.length === 0}
                        onChange={(e) => {
                            if (editingEventId) resetEventForm();
                            onSelectEvent(e.target.value);
                        }}
                    >
                        {events.length === 0 && <option value="">Todavía no creaste eventos</option>}
                        {events.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}
                    </select>
                </div>
            </div>
            {event ? (
                <>
                    <div className="event-management-actions">
                        <button type="button" className="button-secondary" onClick={startEditingEvent}>
                            Editar evento
                        </button>
                        <button
                            type="button"
                            className="button-danger"
                            disabled={eventPurchases.length > 0}
                            onClick={deleteEvent}
                        >
                            Eliminar evento
                        </button>
                    </div>
                    {eventPurchases.length > 0 && (
                        <p className="muted">
                            No se puede eliminar: el evento tiene compras asociadas.
                        </p>
                    )}
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
