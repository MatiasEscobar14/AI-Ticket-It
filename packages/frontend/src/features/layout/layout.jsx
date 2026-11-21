import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/headers/header.jsx';
import Navbar from '../../components/headers/Navbar.jsx';

const Layout = () => {
    const [navigation, setNavigation] = useState({ section: 'buscar', revision: 0 });
    const [activeRole, setActiveRole] = useState('comprador');
    const [activeUser, setActiveUser] = useState(null);
    const selectSection = (section) => {
        setNavigation((current) => ({ section, revision: current.revision + 1 }));
    };

    return (
        <>
            <Header />
            <Navbar
                activeRole={activeRole}
                activeSection={navigation.section}
                hasUser={Boolean(activeUser)}
                onSelect={selectSection}
                onLogout={() => {
                    setActiveUser(null);
                    setActiveRole('comprador');
                    selectSection('buscar');
                }}
            />
            <main id="main" className="ticket-main" tabIndex="-1">
                <Outlet context={{
                    activeUser,
                    setActiveUser,
                    activeRole,
                    activeSection: navigation.section,
                    navigationRevision: navigation.revision,
                    setActiveSection: selectSection,
                    setActiveRole,
                }} />
            </main>
        </>
    );
};

export default Layout;