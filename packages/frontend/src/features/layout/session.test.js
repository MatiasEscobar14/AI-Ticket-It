import { loadSession, saveSession } from './session';

beforeEach(() => {
    window.localStorage.clear();
});

test('restores a saved session with only the user identity needed by the app', () => {
    saveSession({
        role: 'comprador',
        user: {
            id: 'buyer-1',
            nombre: 'Luis',
            apellido: 'Comprador',
            favoritos: ['event-1'],
        },
    });

    expect(loadSession()).toEqual({
        role: 'comprador',
        user: {
            id: 'buyer-1',
            nombre: 'Luis',
            apellido: 'Comprador',
        },
    });
});

test('clears malformed saved session data', () => {
    window.localStorage.setItem('ai-ticket-it.session', '{invalid');

    expect(loadSession()).toBeNull();
    expect(window.localStorage.getItem('ai-ticket-it.session')).toBeNull();
});

test('clears saved data with an invalid role or missing user id', () => {
    window.localStorage.setItem('ai-ticket-it.session', JSON.stringify({
        role: 'admin',
        user: { nombre: 'Luis' },
    }));

    expect(loadSession()).toBeNull();
    expect(window.localStorage.getItem('ai-ticket-it.session')).toBeNull();
});
