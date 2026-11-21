import './Navbar.css';

const sections = [
    { id: 'buscar', label: 'Buscar eventos' },
    { id: 'compras', label: 'Mis compras' },
    { id: 'organizador', label: 'Panel organizador' },
];

const Navbar = ({ activeRole, activeSection, hasUser, onSelect, onLogout }) => {
    const visibleSections = activeRole === 'comprador'
        ? sections.filter((section) => section.id !== 'organizador')
        : sections.filter((section) => section.id === 'organizador');

    return (
        <header className="ticket-navbar">
            <div className="ticket-navbar-inner">
                <a href="#main" className="ticket-brand">AI Ticket It</a>
                {hasUser && (
                    <div className="ticket-navbar-actions">
                        <nav className="ticket-tabs" aria-label="Secciones">
                            {visibleSections.map((section) => (
                                <button
                                    key={section.id}
                                    type="button"
                                    aria-current={activeSection === section.id ? 'page' : undefined}
                                    onClick={() => onSelect(section.id)}
                                >
                                    {section.label}
                                </button>
                            ))}
                        </nav>
                        <button className="ticket-logout" type="button" onClick={onLogout}>
                            Cerrar sesión
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;