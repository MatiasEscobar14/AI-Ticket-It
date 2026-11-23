import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api } from '../../services/api';
import ChatView from './components/ChatView';
import ComprasView from './components/ComprasView';
import EventoDetail from './components/EventoDetail';
import EventosView from './components/EventosView';
import OrganizadorView from './components/OrganizadorView';
import { formatMoney, getDaysUntil, getOrganizerName } from './eventUtils';
import { prepareDemoData } from './demoData';
import { identifyRole, normalizeEvents } from './homeData';
import './home.css';

const userName = (user) =>
    [user?.nombre, user?.apellido].filter(Boolean).join(' ') || 'Usuario';

const normalizePurchase = (purchase, users, actorId) => ({
    ...purchase,
    eventId: String(purchase.evento),
    compradorId: String(purchase.comprador),
    tipo: purchase.tipoEntrada?.nombre || 'Entrada',
    estado: purchase.estado.toUpperCase(),
    mensajesPayload: (purchase.mensajesPayload || purchase.mensajes || []).map((message) => ({
        usuario: String(message.usuario),
        mensaje: message.mensaje,
        enviado: message.enviado || message.createdAt || message.updatedAt,
    })),
    mensajes: (purchase.mensajesPayload || purchase.mensajes || []).map((message, index) => {
        const authorId = String(message.usuario);
        const date = new Date(message.enviado || message.createdAt || message.updatedAt || Date.now());
        return {
            id: message.id || `${purchase.id}-${index}`,
            me: authorId === String(actorId),
            autor: userName(users.find((user) => user.id === authorId)),
            texto: message.mensaje,
            hora: date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
        };
    }),
});

const loadDashboard = async (userId = null) => {
    const [events, categories, users, reviews, purchases] = await Promise.all([
        api.getEvents(),
        api.getCategories(),
        api.getUsers(),
        api.getReviews(),
        userId ? api.getPurchasesByBuyer(userId) : Promise.resolve([]),
    ]);

    return {
        categories,
        users,
        reviews,
        events: normalizeEvents(events, categories, users, reviews),
        purchases: purchases.map((purchase) => normalizePurchase(purchase, users, userId)),
    };
};

const Home = () => {
    const {
        activeRole,
        activeSection,
        activeUser,
        navigationRevision,
        setActiveSection,
        setActiveRole,
        setActiveUser,
    } = useOutletContext();
    const [initialUser] = useState(activeUser);
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [organizerAccount, setOrganizerAccount] = useState(null);
    const [purchases, setPurchases] = useState([]);
    const [organizerPurchases, setOrganizerPurchases] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [view, setView] = useState(activeSection);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [organizerEventId, setOrganizerEventId] = useState('');
    const [chatPurchaseId, setChatPurchaseId] = useState(null);
    const [chatRole, setChatRole] = useState('comprador');
    const [ordersVersion, setOrdersVersion] = useState(0);
    const [loading, setLoading] = useState(true);
    const [startingSession, setStartingSession] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');
    const [announcement, setAnnouncement] = useState('');

    const eventsById = useMemo(
        () => Object.fromEntries(events.map((event) => [event.id, event])),
        [events]
    );
    const selectedEvent = selectedEventId === null ? null : eventsById[selectedEventId];
    const organizerEvents = useMemo(
        () => events.filter((event) => String(event.organizador?.id) === String(activeUser?.id)),
        [activeUser, events]
    );
    const organizerEvent = organizerEvents.find((event) => event.id === organizerEventId)
        || organizerEvents[0]
        || null;
    const reviewedEvents = useMemo(
        () => new Set(reviews
            .filter((review) => review.comprador === activeUser?.id)
            .map((review) => review.evento)),
        [activeUser, reviews]
    );
    const chatPurchase = (chatRole === 'organizador' ? organizerPurchases : purchases)
        .find((purchase) => purchase.id === chatPurchaseId);
    const chatEvent = chatPurchase ? eventsById[chatPurchase.eventId] : null;
    const chatActorId = chatRole === 'comprador' ? activeUser?.id : chatEvent?.organizador?.id;
    const chatParticipantName = chatRole === 'comprador'
        ? getOrganizerName(chatEvent?.organizador)
        : userName(users.find((user) => user.id === chatPurchase?.compradorId));
    const chatMessages = chatPurchase && chatActorId
        ? normalizePurchase(chatPurchase, users, chatActorId)
        : chatPurchase;

    const announce = (message) => {
        setAnnouncement('');
        window.setTimeout(() => setAnnouncement(message), 30);
    };

    const applyDashboard = (dashboard, user = activeUser) => {
        setEvents(dashboard.events);
        setCategories(dashboard.categories);
        setUsers(dashboard.users);
        setReviews(dashboard.reviews);
        setPurchases(dashboard.purchases);
        const ownedEvents = user
            ? dashboard.events.filter((event) => String(event.organizador?.id) === String(user.id))
            : [];
        setOrganizerEventId((current) => (
            ownedEvents.some((event) => event.id === current)
                ? current
                : ownedEvents[0]?.id || ''
        ));
    };

    const refreshDashboard = async () => {
        if (!activeUser) return;
        const dashboard = await loadDashboard(activeUser.id);
        applyDashboard(dashboard, activeUser);
        setOrdersVersion((current) => current + 1);
    };

    useEffect(() => {
        let active = true;
        const initialize = async () => {
            try {
                setLoading(true);
                setError('');
                const demoData = await prepareDemoData();
                if (!active) return;
                setOrganizerAccount(demoData.organizer);
                const dashboard = await loadDashboard(initialUser?.id ?? null);
                if (!active) return;
                applyDashboard(dashboard, initialUser);
            } catch (loadError) {
                if (active) setError(loadError.message);
            } finally {
                if (active) setLoading(false);
            }
        };
        initialize();
        return () => { active = false; };
    }, [initialUser]);

    const startSession = async (formEvent) => {
        formEvent.preventDefault();
        const nombre = firstName.trim();
        const apellido = lastName.trim();
        if (!nombre || !apellido) return;

        try {
            setStartingSession(true);
            setError('');
            const role = identifyRole(nombre, apellido, organizerAccount);
            const isOrganizer = role === 'organizador';
            const existingBuyer = users.find(
                (user) => user.nombre === nombre && user.apellido === apellido
            );
            const user = isOrganizer
                ? organizerAccount
                : existingBuyer || await api.createUser({ nombre, apellido, favoritos: [] });
            const dashboard = await loadDashboard(user.id);
            applyDashboard(dashboard, user);
            setActiveUser(user);
            setActiveRole(role);
            setActiveSection(role === 'comprador' ? 'buscar' : 'organizador');
        } catch (sessionError) {
            setError(sessionError.message);
        } finally {
            setStartingSession(false);
        }
    };

    useEffect(() => {
        setView(activeSection);
    }, [activeSection, navigationRevision]);

    useEffect(() => {
        if (!activeUser) {
            document.getElementById('h-session-start')?.focus();
        } else if (view === 'organizador') {
            document.getElementById('h-organizador')?.focus();
        } else if (view === 'chat') {
            document.getElementById('h-chat')?.focus();
        } else {
            const heading = {
                buscar: 'h-buscar',
                detalle: 'h-detalle',
                compras: 'h-compras',
            }[view];
            if (heading) document.getElementById(heading)?.focus();
        }
        window.scrollTo(0, 0);
    }, [activeUser, view, selectedEventId]);

    useEffect(() => {
        const viewingOrganizerPurchases = view === 'organizador'
            || (view === 'chat' && chatRole === 'organizador');
        if (!viewingOrganizerPurchases || !organizerEventId) return undefined;
        let active = true;
        api.getPurchasesByEvent(organizerEventId)
            .then((rows) => {
                if (active) {
                    setOrganizerPurchases(rows.map((purchase) =>
                        normalizePurchase(purchase, users, activeUser?.id)
                    ));
                }
            })
            .catch((loadError) => {
                if (active) setError(loadError.message);
            });
        return () => { active = false; };
    }, [activeUser?.id, chatRole, organizerEventId, ordersVersion, users, view]);

    const openEvent = (eventId) => {
        setSelectedEventId(eventId);
        setView('detalle');
    };

    const createPurchase = async (event, ticket, quantity) => {
        try {
            await api.createPurchase({
                comprador: activeUser.id,
                evento: event.id,
                tipoEntrada: ticket.id,
                cantidad: quantity,
                total: ticket.precio * quantity,
                estado: 'pendiente',
                mensajes: [],
            });
            await refreshDashboard();
            setError('');
            setView('compras');
            setActiveSection('compras');
            announce(`Compra creada. ${quantity} entradas ${ticket.nombre}.`);
        } catch (purchaseError) {
            setError(purchaseError.message);
            announce(purchaseError.message);
        }
    };

    const cancelPurchase = async (purchaseId) => {
        const purchase = purchases.find((item) => item.id === purchaseId);
        if (!purchase) return;
        const event = eventsById[purchase.eventId];
        if (!event || new Date(event.fecha).getTime() <= Date.now()) {
            setError('El evento ya se realizó; no se puede cancelar la compra.');
            return;
        }
        if (!window.confirm(`¿Cancelar la compra y reembolsar ${formatMoney(purchase.total)}?`)) return;

        try {
            await api.cancelPurchase(purchaseId);
            await refreshDashboard();
            setError('');
            announce('Compra cancelada y reembolsada.');
        } catch (cancelError) {
            setError(cancelError.message);
        }
    };

    const createReview = async (purchase, score, detail) => {
        try {
            await api.createReview({
                comprador: activeUser.id,
                evento: purchase.eventId,
                puntuacion: score,
                detalle: detail,
            });
            await refreshDashboard();
            setError('');
            announce('Gracias por compartir tu reseña.');
        } catch (reviewError) {
            setError(reviewError.message);
        }
    };

    const createEvent = async (eventData) => {
        try {
            const created = await api.createEvent({
                ...eventData,
                organizador: activeUser.id,
                multimedia: [],
            });
            await refreshDashboard();
            setOrganizerEventId(created.id);
            setError('');
            announce('Evento publicado.');
        } catch (createError) {
            setError(createError.message);
            throw createError;
        }
    };

    const updateEvent = async (eventId, eventData) => {
        try {
            await api.updateEvent(eventId, {
                ...eventData,
                organizador: activeUser.id,
                multimedia: [],
            });
            await refreshDashboard();
            setError('');
            announce('Evento actualizado.');
        } catch (updateError) {
            setError(updateError.message);
            throw updateError;
        }
    };

    const deleteEvent = async (eventId) => {
        try {
            await api.deleteEvent(eventId);
            setOrganizerPurchases([]);
            await refreshDashboard();
            setError('');
            announce('Evento eliminado.');
        } catch (deleteError) {
            setError(deleteError.message);
            throw deleteError;
        }
    };

    const updatePurchaseStatus = async (purchaseId, status) => {
        try {
            await api.updatePurchase(purchaseId, { estado: status.toLowerCase() });
            await refreshDashboard();
            setError('');
            announce(`Estado de compra actualizado a ${status.toLowerCase()}.`);
        } catch (updateError) {
            setError(updateError.message);
        }
    };

    const openChat = (purchaseId, role) => {
        setChatPurchaseId(purchaseId);
        setChatRole(role);
        setView('chat');
    };

    const sendMessage = async (purchaseId, text) => {
        const purchase = (chatRole === 'organizador' ? organizerPurchases : purchases)
            .find((item) => item.id === purchaseId);
        if (!purchase || !chatActorId) return;
        try {
            await api.updatePurchase(purchaseId, {
                mensajes: [
                    ...purchase.mensajesPayload,
                    { usuario: chatActorId, mensaje: text, enviado: new Date().toISOString() },
                ],
            });
            await refreshDashboard();
            setError('');
        } catch (messageError) {
            setError(messageError.message);
        }
    };

    const backToEvents = () => {
        setView('buscar');
        setActiveSection('buscar');
    };

    const backFromChat = () => {
        const section = chatRole === 'comprador' ? 'compras' : 'organizador';
        setView(section);
        setActiveSection(section);
    };

    if (loading) {
        return <div className="home-content" role="status">Conectando con el servidor…</div>;
    }

    if (!activeUser) {
        return (
            <div className="home-content">
                <section className="session-start" aria-labelledby="h-session-start">
                    <h1 id="h-session-start" tabIndex="-1">
                        Bienvenido a Ticket It. Ingresá tu nombre y apellido.
                    </h1>
                    <form className="session-start-form" onSubmit={startSession}>
                        <div>
                            <label htmlFor="session-first-name">Nombre</label>
                            <input
                                id="session-first-name"
                                autoComplete="given-name"
                                required
                                value={firstName}
                                onChange={(event) => setFirstName(event.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="session-last-name">Apellido</label>
                            <input
                                id="session-last-name"
                                autoComplete="family-name"
                                required
                                value={lastName}
                                onChange={(event) => setLastName(event.target.value)}
                            />
                        </div>
                        <button type="submit" className="button-primary" disabled={startingSession}>
                            {startingSession ? 'Ingresando…' : 'Continuar'}
                        </button>
                        {error && <p className="form-error" role="alert">{error}</p>}
                    </form>
                </section>
            </div>
        );
    }

    let content;
    if (view === 'detalle' && selectedEvent) {
        content = (
            <EventoDetail
                key={selectedEvent.id}
                event={selectedEvent}
                reviews={selectedEvent.resenias}
                onBack={backToEvents}
                onPurchase={createPurchase}
            />
        );
    } else if (view === 'compras') {
        content = (
            <ComprasView
                purchases={purchases}
                eventsById={eventsById}
                reviewedEvents={reviewedEvents}
                onChat={(id) => openChat(id, 'comprador')}
                onCancel={cancelPurchase}
                onReview={createReview}
            />
        );
    } else if (view === 'chat' && chatPurchase && chatEvent) {
        content = (
            <ChatView
                event={chatEvent}
                purchase={chatMessages}
                participantName={chatParticipantName}
                senderLabel={chatRole === 'comprador' ? userName(activeUser) : getOrganizerName(chatEvent.organizador)}
                backLabel={chatRole === 'comprador' ? 'Volver a mis compras' : 'Volver al panel organizador'}
                onBack={backFromChat}
                onSend={sendMessage}
            />
        );
    } else if (view === 'organizador') {
        content = (
            <OrganizadorView
                event={organizerEvent}
                events={organizerEvents}
                purchases={organizerPurchases}
                eventsById={eventsById}
                categories={categories}
                selectedEventId={organizerEventId}
                onSelectEvent={(eventId) => {
                    setOrganizerPurchases([]);
                    setOrganizerEventId(eventId);
                }}
                onCreateEvent={createEvent}
                onUpdateEvent={updateEvent}
                onDeleteEvent={deleteEvent}
                onUpdateStatus={updatePurchaseStatus}
                onChat={(id) => openChat(id, 'organizador')}
            />
        );
    } else {
        content = <EventosView events={events} onOpen={openEvent} />;
    }

    return (
        <div className="home-content">
            <div className="sr-only" aria-live="polite">{announcement}</div>
            {error && <p className="form-error" role="alert">{error}</p>}
            {activeRole !== 'organizador' && (
                <p className="demo-user-note">
                    ¡Hola, {userName(activeUser)}. Bienvenido a Ticket It. ¿Listo para ir a un evento?
                </p>
            )}
            {content}
        </div>
    );
};

export default Home;
