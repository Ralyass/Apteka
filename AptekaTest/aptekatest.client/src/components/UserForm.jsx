import React, { useState } from 'react';

// Style tylko dla formularza
const styles = {
    form: { marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f9f9f9' },
    input: { width: '100%', padding: '8px', margin: '5px 0 10px 0', boxSizing: 'border-box' },
    select: { width: '100%', padding: '8px', margin: '5px 0 10px 0' },
    button: { marginRight: '5px', padding: '5px 10px', cursor: 'pointer', border: 'none', borderRadius: '4px', color: 'white' },
    addButton: { backgroundColor: '#28a745' },
};

// Formularz został przeniesiony do własnego komponentu
function UserForm({ userToEdit, onClose }) {
    // Stan formularza
    const [form, setForm] = useState(
        userToEdit
            ? { id: userToEdit.id, username: userToEdit.username, role: userToEdit.role, password: '' }
            : { username: '', password: '', role: '' }
    );
    const [formError, setFormError] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Logika zapisu
    const handleSave = async (e) => {
        e.preventDefault();
        setFormError(null);

        const method = userToEdit ? 'PUT' : 'POST';
        const url = userToEdit ? `https://localhost:7130/api/users/${userToEdit.id}` : 'https://localhost:7130/api/users';

        const payload = { ...form };

        // Jeśli edytujemy (PUT) i pole hasła jest puste,
        // usuwamy klucz 'password' z obiektu,
        // aby serwer go nie aktualizował.
        if (method === 'PUT' && payload.password === '') {
            delete payload.password;
        }

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // 🔑 Uwierzytelnienie
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || `Błąd serwera: ${res.status}`);
            }
            onClose(); // Zamknij i odśwież (wywołuje funkcję z AdminUsers)
        } catch (err) {
            setFormError(err.message);
        }
    };

    return (
        <form style={styles.form} onSubmit={handleSave}>
            <h3>{userToEdit ? 'Edytuj użytkownika' : 'Dodaj nowego użytkownika'}</h3>
            {formError && <p style={{ color: 'red' }}>BŁĄD: {formError}</p>}
            <input
                style={styles.input}
                type="text"
                name="username"
                placeholder="Login"
                value={form.username}
                onChange={handleChange}
                required
            />
            <input
                style={styles.input}
                type="password"
                name="password"
                placeholder={userToEdit ? "Wpisz NOWE hasło (zostaw puste aby nie zmieniać)" : "Hasło"}
                value={form.password}
                onChange={handleChange}
                required={!userToEdit} // Hasło wymagane tylko przy tworzeniu
            />
            <select style={styles.select} name="role" value={form.role} onChange={handleChange} required>
                <option value="">Wybierz rolę</option>
                <option value="Admin">Admin</option>
                <option value="Kierownik">Kierownik</option>
                <option value="Farmaceuta">Farmaceuta</option>
            </select>
            <button type="submit" style={{ ...styles.button, ...styles.addButton }}>Zapisz</button>
            <button type="button" style={{ ...styles.button, backgroundColor: '#6c757d' }} onClick={onClose}>Anuluj</button>
        </form>
    );
}

export default UserForm;