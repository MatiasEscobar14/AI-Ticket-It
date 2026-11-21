import { useEffect, useState } from 'react';
import './header.css';

const Header = () => {
    const [highContrast, setHighContrast] = useState(false);

    useEffect(() => {
        document.documentElement.classList.toggle('high-contrast', highContrast);
    }, [highContrast]);

    useEffect(() => {
        if (window.matchMedia('(prefers-contrast: more)').matches) {
            setHighContrast(true);
        }
    }, []);

    return (
        <a className="skip-link" href="#main">Saltar al contenido</a>
    );
};

export default Header;