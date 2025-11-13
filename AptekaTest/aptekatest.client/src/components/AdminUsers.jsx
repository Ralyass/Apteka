import React, { useEffect, useState } from 'react';
import '../styles/AdminUsers.css';

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editUser, setEditUser] = useState(null);

    // Pobierz listę użytkowników po załadowaniu komponentu
    useEffect(() => {
        fetch('https://localhost:7130/api/users')
            .then(res => res.json())
            .then(data => setUsers(data));
    }, []);

    // Obsługa usuwania użytkownika
    const handleDelete = async (id) => {
        await fetch(`https://localhost:7130/api/users/${id}`, { method: 'DELETE' });
        setUsers(users.filter(user => user.id !== id));
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
    const closeFormReload = async () => {
        setShowForm(false);
        // można pobrać jeszcze raz użytkowników z serwera
        const res = await fetch('https://localhost:7130/api/users');
        const data = await res.json();
        setUsers(data);
    };

    return (
        <div>
            <h2>Użytkownicy</h2>
            <button onClick={handleAdd}>Dodaj użytkownika</button>
            <table>
                <thead>
                    <tr>
                        <th>Login</th>
                        <th>Haslo</th>
                        <th>Rola</th>
                        <th>Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
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
                <UserForm user={editUser} onClose={closeFormReload} />
            )}
        </div>
    );
}

// Prosty formularz (do rozwinięcia według potrzeb)
function UserForm({ user, onClose }) {
    const [form, setForm] = useState(user || { username: '', password: '', role: '' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Dodawanie/edycja użytkownika
    const handleSave = async (e) => {
        e.preventDefault();
        const method = user ? 'PUT' : 'POST';
        const url = user ? `https://localhost:7130/api/users/${user.id}` : 'https://localhost:7130/api/users';
        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
        onClose();
    };

    return (
        <form onSubmit={handleSave}>
            <input type="text" name="username" placeholder="Login" value={form.username} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Haslo" value={form.password} onChange={handleChange} required />
            <select name="role" value={form.role} onChange={handleChange} required>
                <option value="">Wybierz rolę</option>
                <option value="Admin">Admin</option>
                <option value="Kierownik">Kierownik</option>
                <option value="Farmaceuta">Farmaceuta</option>
            </select>
            <button type="submit">Zapisz</button>
            <button type="button" onClick={onClose}>Anuluj</button>
        </form>
    );
}

export default AdminUsers;
