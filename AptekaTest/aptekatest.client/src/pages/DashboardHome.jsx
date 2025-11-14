import React from 'react';

// Komponent używa teraz klas CSS z Dashboard.css
function DashboardHome({ user }) {
    return (
        <div className="content-card">
            <h2>Witaj, {user.username}!</h2>
            <p>Jesteś zalogowany jako: <strong>{user.role}</strong>.</p>
            <p>Wybierz jedną z opcji w menu po lewej stronie, aby rozpocząć pracę.</p>
            <p>Ten layout jest inspirowany Twoim zrzutem ekranu KS-AOW, ale jest nowocześniejszy i w pełni responsywny.</p>
        </div>
    );
}

export default DashboardHome;