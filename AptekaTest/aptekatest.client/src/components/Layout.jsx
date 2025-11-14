import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
// Zakładamy, że Dashboard.css jest importowany w main.jsx
// import '../styles/Dashboard.css'; 

/**
 * Główny Layout (Sidebar + Header + Content)
 * Ten komponent opakowuje wszystkie chronione strony.
 */
function Layout({ user, onLogout }) {
    return (
        <div className="layout-container">
            <Sidebar user={user} />
            <main className="layout-main">
                <Header user={user} onLogout={onLogout} />
                <div className="layout-content">
                    {/* Tutaj React Router wyrenderuje komponent dla danej trasy (np. AdminUsers) */}
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default Layout;