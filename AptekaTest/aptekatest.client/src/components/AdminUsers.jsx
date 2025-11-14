import React, { useEffect, useState } from 'react';
import '../styles/AdminUsers.css';
import UserForm from './UserForm';

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [error, setError] = useState(null);]

    // Pobierz listę użytkowników po załadowaniu komponentu
    const fetchUsers = async () => {
        setError(null);
        try {
            const res = await fetch('https://localhost:7130/api/users', {
                credentials: 'include',
            });
            if (!res.ok) {
                throw new Error(`Nie udało się pobra użytkowników: ${res.status} ${res.statusText}`)
            }

            const data = await res.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        }
    };
    // Obsługa usuwania użytkownika
    const handleDelete = async (id) => {
        if (window.confirm('Czy na pewno chcesz usunąć tego użytkownika?')) {
            try {
                await fetch(`https://localhost:7130/api/users/${id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
                setUsers(users.filter(user => user.id !== id));
            } catch (err) {
                setError(`Nie udało się usunąć użytkownika: ${err.message}`);
            }
        }
    };

    // Obsługa otwierania formularza do dodawania/edycji
    const handleEdit = (user) => {
        setEditUser(user);
        setShowForm(true);
    };

    const handleAdd = () => {
        setEditUser(null);
        setShowForm(true);
    };

    // Zamknięcie formularza i odświeżenie listy
    const closeFormReload =  () => {
        setShowForm(false);
        fetchUsers();
    };

    return (
        <div>
            <h2>Zarządzanie Użytkownikami</h2>
            <button onClick={handleAdd}>Dodaj użytkownika</button>
            <table>
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
                            <td>{user.password}</td>
                            <td>{user.role}</td>
                            <td>
                                <button onClick={() => handleEdit(user)}>Edytuj</button>
                                <button onClick={() => handleDelete(user.id)}>Usuń</button>
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
