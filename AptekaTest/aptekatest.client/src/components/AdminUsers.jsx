import React, { useEffect, useState } from 'react';
import UserForm from '../components/UserForm'; // Załóżmy, że UserForm jest w components

// Komponent używa teraz klas CSS z Dashboard.css
function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [error, setError] = useState(null);

    const fetchUsers = async () => { /* ... (logika ta sama) ... */
        setError(null);
        try {
            const res = await fetch('https://localhost:7130/api/users', {
                credentials: 'include'
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || `Nie udało się pobrać użytkowników: ${res.status}`);
            }
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        }
    };
    useEffect(() => { fetchUsers(); }, []);

    const handleDelete = async (id) => { /* ... (logika ta sama) ... */
        if (window.confirm('Czy na pewno chcesz usunąć tego użytkownika?')) {
            try {
                const res = await fetch(`https://localhost:7130/api/users/${id}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.error || `Błąd usuwania: ${res.status}`);
                }
                setUsers(users.filter(user => user.id !== id));
            } catch (err) {
                setError(`Błąd podczas usuwania: ${err.message}`);
            }
        }
    };
    const handleEdit = (user) => { setEditUser(user); setShowForm(true); };
    const handleAdd = () => { setEditUser(null); setShowForm(true); };
    const closeFormReload = () => { setShowForm(false); fetchUsers(); };

    return (
        // Używamy klas CSS zamiast stylów inline
        <div className="content-card">
            <h2>Zarządzanie Użytkownikami</h2>
            <button className="admin-button admin-button-add" onClick={handleAdd}>Dodaj użytkownika</button>
            {error && <p style={{ color: 'red' }}>BŁĄD: {error}</p>}

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Login</th>
                        <th>Rola</th>
                        <th>Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.role}</td>
                            <td>
                                <button className="admin-button admin-button-edit" onClick={() => handleEdit(user)}>Edytuj</button>
                                <button className="admin-button admin-button-delete" onClick={() => handleDelete(user.id)}>Usuń</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showForm && (
                <UserForm userToEdit={editUser} onClose={closeFormReload} />
            )}
        </div>
    );
}

export default AdminUsers;