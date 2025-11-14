import React, { useEffect, useState } from 'react';

function MedicineForm({ medicineToEdit, onClose }) {
    // Stan formularza
    const [form, setForm] = useState(
        medicineToEdit
            ? { ...medicineToEdit }
            : { name: '', quantity: 0, price: 0.0, expiryDate: '' }
    );
    const [formError, setFormError] = useState(null);

    // Formatowanie daty dla input[type="date"] (oczekuje RRRR-MM-DD)
    useEffect(() => {
        if (medicineToEdit && medicineToEdit.expiryDate) {
            const formattedDate = new Date(medicineToEdit.expiryDate).toISOString().split('T')[0];
            setForm(f => ({ ...f, expiryDate: formattedDate }));
        }
    }, [medicineToEdit]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Logika zapisu
    const handleSave = async (e) => {
        e.preventDefault();
        setFormError(null);

        const method = medicineToEdit ? 'PUT' : 'POST';
        const url = medicineToEdit ? `https://localhost:7130/api/medicines/${medicineToEdit.id}` : 'https://localhost:7130/api/medicines';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // 🔑 Uwierzytelnienie
                body: JSON.stringify(form),
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || `Błąd serwera: ${res.status}`);
            }
            onClose(); // Zamknij i odśwież
        } catch (err) {
            setFormError(err.message);
        }
    };

    return (
        <form style={styles.form} onSubmit={handleSave}>
            <h3>{medicineToEdit ? 'Edytuj lek' : 'Dodaj nowy lek'}</h3>
            {formError && <p style={{ color: 'red' }}>BŁĄD: {formError}</p>}

            <input
                style={styles.input}
                type="text"
                name="name"
                placeholder="Nazwa leku"
                value={form.name}
                onChange={handleChange}
                required
            />
            <input
                style={styles.input}
                type="number"
                name="quantity"
                placeholder="Ilość"
                value={form.quantity}
                onChange={handleChange}
                required
                min="0"
            />
            <input
                style={styles.input}
                type="number"
                name="price"
                placeholder="Cena"
                value={form.price}
                onChange={handleChange}
                required
                min="0.01"
                step="0.01"
            />
            <input
                style={styles.input}
                type="date"
                name="expiryDate"
                placeholder="Data ważności"
                value={form.expiryDate}
                onChange={handleChange}
                required
            />

            <button type="submit" style={{ ...styles.button, ...styles.addButton }}>Zapisz</button>
            <button type="button" style={{ ...styles.button, backgroundColor: '#6c757d' }} onClick={onClose}>Anuluj</button>
        </form>
    );
}

export default MedicineForm;