import React, { useEffect, useState } from 'react';
// Nie ma już potrzeby definiowania stylów inline

// Komponent dla formularza leków (teraz w osobnym pliku)
// Załóżmy, że jest w ../components/MedicineForm.jsx
// import MedicineForm from '../components/MedicineForm'; 
// ---
// 🔑 POPRAWKA: Tak jak w AdminUsers, trzymajmy formularz w tym samym pliku
// dopóki nie potwierdzimy, że importy działają u Ciebie.
// ---

// Komponent przyjmuje 'user' jako prop
function MedicinesPanel({ user }) {
    const [medicines, setMedicines] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editMedicine, setEditMedicine] = useState(null);
    const [error, setError] = useState(null);

    const canManage = user && (user.role === 'Admin' || user.role === 'Kierownik');

    const fetchMedicines = async () => { /* ... (logika ta sama) ... */
        setError(null);
        try {
            const res = await fetch('https://localhost:7130/api/medicines', {
                credentials: 'include'
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || `Nie udało się pobrać leków: ${res.status}`);
            }
            const data = await res.json();
            setMedicines(data);
        } catch (err) {
            setError(err.message);
        }
    };
    useEffect(() => { fetchMedicines(); }, []);

    const handleDelete = async (id) => { /* ... (logika ta sama) ... */
        if (window.confirm('Czy na pewno chcesz usunąć ten lek?')) {
            try {
                const res = await fetch(`https://localhost:7130/api/medicines/${id}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.error || `Błąd usuwania: ${res.status}`);
                }
                setMedicines(medicines.filter(med => med.id !== id));
            } catch (err) {
                setError(`Błąd podczas usuwania: ${err.message}`);
            }
        }
    };
    const handleEdit = (medicine) => { setEditMedicine(medicine); setShowForm(true); };
    const handleAdd = () => { setEditMedicine(null); setShowForm(true); };
    const closeFormReload = () => { setShowForm(false); fetchMedicines(); };

    return (
        <div className="content-card">
            <h2>Zarządzanie Lekami (Kartoteka)</h2>

            {canManage && (
                <button className="admin-button admin-button-add" onClick={handleAdd}>Dodaj nowy lek</button>
            )}

            {error && <p style={{ color: 'red' }}>BŁĄD: {error}</p>}

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nazwa leku</th>
                        <th>Ilość (szt.)</th>
                        <th>Cena (PLN)</th>
                        <th>Data ważności</th>
                        {canManage && <th>Akcje</th>}
                    </tr>
                </thead>
                <tbody>
                    {medicines.map(med => (
                        <tr key={med.id}>
                            <td>{med.id}</td>
                            <td>{med.name}</td>
                            <td>{med.quantity}</td>
                            <td>{med.price.toFixed(2)}</td>
                            <td>{new Date(med.expiryDate).toLocaleDateString()}</td>
                            {canManage && (
                                <td>
                                    <button className="admin-button admin-button-edit" onClick={() => handleEdit(med)}>Edytuj</button>
                                    <button className="admin-button admin-button-delete" onClick={() => handleDelete(med.id)}>Usuń</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {showForm && (
                <MedicineForm medicineToEdit={editMedicine} onClose={closeFormReload} />
            )}
        </div>
    );
}
export default MedicinesPanel;