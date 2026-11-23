const SESSION_KEY = 'ai-ticket-it.session';
const VALID_ROLES = ['comprador', 'organizador'];

export const loadSession = () => {
    const storedSession = window.localStorage.getItem(SESSION_KEY);
    if (!storedSession) return null;

    let session;
    try {
        session = JSON.parse(storedSession);
    } catch (error) {
        if (!(error instanceof SyntaxError)) throw error;
        window.localStorage.removeItem(SESSION_KEY);
        return null;
    }

    const user = session?.user;
    if (
        !user
        || user.id === undefined
        || user.id === null
        || !VALID_ROLES.includes(session.role)
    ) {
        window.localStorage.removeItem(SESSION_KEY);
        return null;
    }

    return {
        role: session.role,
        user: {
            id: user.id,
            nombre: user.nombre,
            apellido: user.apellido,
        },
    };
};

export const saveSession = (session) => {
    if (!session?.user) {
        window.localStorage.removeItem(SESSION_KEY);
        return;
    }

    window.localStorage.setItem(SESSION_KEY, JSON.stringify({
        role: session.role,
        user: {
            id: session.user.id,
            nombre: session.user.nombre,
            apellido: session.user.apellido,
        },
    }));
};
