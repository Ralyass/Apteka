import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Importujemy nasz nowy, główny layout
import Layout from './components/Layout';

// Importujemy nasze strony
import LogIn from './pages/LogIn';
import DashboardHome from './pages/DashboardHome';
import AdminUsers from './components/AdminUsers';
import MedicinesPanel from './pages/MedicinesPanel';
import SalesPanel from './pages/SalesPanel';
import OrderHistory from './pages/OrderHistory';
// import NotFound from './pages/NotFound'; // Możesz go stworzyć

// Główny komponent aplikacji
function App() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Sprawdzanie sesji użytkownika
    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const response = await fetch("https://localhost:7130/api/auth/checkauth", {
                    method: "GET",
                    credentials: "include",
                });
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Błąd sprawdzania sesji:", error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        checkUserSession();
    }, []);

    const handleLogin = (data) => {
        setUser(data);
    };

    const handleLogout = async () => {
        await fetch('https://localhost:7130/api/auth/logout', {
            method: 'POST',
            credentials: "include"
        });
        setUser(null);
    };

    if (isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Ładowanie...</div>;
    }

    return (
        <Routes>
            {/* 1. Trasa Logowania */}
            <Route
                path="/login"
                element={!user ? <LogIn onLogin={handleLogin} /> : <Navigate to="/" replace />}
            />

            {/* 2. Główne trasy aplikacji (opakowane w Layout) */}
            <Route
                path="/"
                element={user ? <Layout user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
            >
                {/* Strona główna */}
                <Route index element={<DashboardHome user={user} />} />

                {/* Dostępne dla wszystkich ról */}
                <Route path="medicines" element={<MedicinesPanel user={user} />} />

                {/* Dostępne dla Farmaceuty, Kierownika, Admina */}
                <Route path="sales" element={
                    (user?.role === 'Admin' || user?.role === 'Kierownik' || user?.role === 'Farmaceuta') ?
                        <SalesPanel user={user} /> :
                        <Navigate to="/" replace />
                } />

                {/* Dostępne tylko dla Kierownika i Admina */}
                <Route path="orders" element={
                    (user?.role === 'Admin' || user?.role === 'Kierownik') ?
                        <OrderHistory user={user} /> :
                        <Navigate to="/" replace />
                } />

                {/* Dostępne tylko dla Admina */}
                <Route path="users" element={
                    user?.role === 'Admin' ?
                        <AdminUsers /> : // Zakładamy, że AdminUsers nie potrzebuje 'user' propa, bo jest już chroniony
                        <Navigate to="/" replace />
                } />

                {/* Strona 404 */}
                <Route path="*" element={
                    <div className="content-card"><h2>404 - Strona nie znaleziona</h2></div>
                } />
            </Route>
        </Routes>
    );
}

export default App;