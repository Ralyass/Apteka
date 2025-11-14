import React, { useState } from 'react';

function UserForm({ userToEdit, onClose }) {
    const [form, setForm] = useState(
        userToEdit
            ? { id: userToEdit.id, username: userToEdit.username, role: userToEdit.role, password: '' }
            : { username: '', password: '', role: '' }
    );

    const [formError, setFormError] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setFormError(null);

        const method = userToEdit ? 'PUT' : 'POST';
        const url = userToEdit ? `https://localhost:7130/api/users/${userToEdit.id}` : 'https://localhost:7130/api/users';

        const payload = { ...form };

        if (method === 'PUT' && payload.password === '') {
            delete payload.password; 
        }

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || `Błąd serwera: ${res.status}`);
            }
        }

    }



}
export default UserForm;