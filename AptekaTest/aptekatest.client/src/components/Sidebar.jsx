import React from 'react';
import { NavLink } from 'react-router-dom';

// ----- IKONY SVG -----
const IconDashboard = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const IconUsers = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const IconMedicines = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>;
const IconSales = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const IconHistory = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>;

/**
 * Boczne menu (Sidebar)
 */
function Sidebar({ user }) {
    const { role } = user;

    return (
        <nav className="layout-sidebar">
            <div className="sidebar-logo">
                AptekaTest
            </div>
            <ul className="sidebar-menu">
                {/* Linki widoczne dla wszystkich */}
                <li>
                    {/* 'end' jest ważne dla strony głównej */}
                    <NavLink to="/" end className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                        <IconDashboard /> Dashboard
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/medicines" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                        <IconMedicines /> Kartoteka Leków
                    </NavLink>
                </li>

                {/* Linki dla Farmaceuty (i wyższych ról) */}
                {(role === 'Farmaceuta' || role === 'Kierownik' || role === 'Admin') && (
                    <li>
                        <NavLink to="/sales" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                            <IconSales /> Sprzedaż
                        </NavLink>
                    </li>
                )}

                {/* Linki dla Kierownika (i wyższych ról) */}
                {(role === 'Kierownik' || role === 'Admin') && (
                    <li>
                        <NavLink to="/orders" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                            <IconHistory /> Historia Zamówień
                        </NavLink>
                    </li>
                )}

                {/* Linki tylko dla Admina */}
                {role === 'Admin' && (
                    <li>
                        <NavLink to="/users" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                            <IconUsers /> Użytkownicy
                        </NavLink>
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default Sidebar;