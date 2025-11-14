import React from 'react';

// Placeholder dla panelu sprzedaży
function SalesPanel({ user }) {
    // TODO: Zaimplementować logikę sprzedaży (koszyk, wybór leków z /api/medicines)
    // i wysyłanie do /api/orders
    return (
        <div className="content-card">
            <h2>Punkt Sprzedaży (POS)</h2>
            <p>Ta sekcja jest w budowie. Zalogowano jako: <strong>{user.role}</strong>.</p>
            <p>Tutaj znajdzie się interfejs do sprzedaży leków (tworzenia `Order`), który będzie dostępny dla Farmaceuty, Kierownika i Admina.</p>
        </div>
    );
}

export default SalesPanel;