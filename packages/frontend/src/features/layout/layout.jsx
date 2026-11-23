import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/headers/header.jsx';
import Navbar from '../../components/headers/Navbar.jsx';
import { loadSession, saveSession } from './session';

const Layout = () => {
    const [navigation, setNavigation] = useState({ section: 'buscar', revision: 0 });
    const [session, setSession] = useState(loadSession);
    const activeRole = session?.role || 'comprador';
    const activeUser = session?.user || null;

    useEffect(() => {
        saveSession(session);
    }, [session]);

    const setActiveUser = (user) => {
        setSession((current) => ({
            user,
            role: current?.role || 'comprador',
        }));
    };
    const setActiveRole = (role) => {
        setSession((current) => ({
            user: current?.user || null,
            role,
        }));
    };

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
                    setSession(null);
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