import React from 'react';

// Placeholder dla historii zamówień
function OrderHistory({ user }) {
    // TODO: Zaimplementować pobieranie i wyświetlanie historii zamówień z /api/orders
    // Pamiętaj o credentials: 'include'
    return (
        <div className="content-card">
            <h2>Historia Zamówień</h2>
            <p>Ta sekcja jest w budowie. Zalogowano jako: <strong>{user.role}</strong>.</p>
            <p>Tutaj znajdzie się historia wszystkich paragonów (zamówień), dostępna dla Kierownika i Admina.</p>
        </div>
    );
}

export default OrderHistory;