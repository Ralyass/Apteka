import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Górny pasek (Navbar)
 */
function Header({ user, onLogout }) {
    const navigate = useNavigate(); // Hook do nawigacji

    const handleLogoutClick = () => {
        onLogout();
        navigate('/login'); // Przekieruj do logowania po wylogowaniu
    };

    return (
        <header className="layout-header">
            <div className="header-user-info">
                Witaj, <strong>{user.username}</strong> <span>({user.role})</span>
            </div>
            <button className="header-logout-button" onClick={handleLogoutClick}>
                Wyloguj
            </button>
        </header>
    );
}

export default Header;