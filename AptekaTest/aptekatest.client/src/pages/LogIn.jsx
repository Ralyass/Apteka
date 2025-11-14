import { useState } from "react";
// Usunęliśmy import LogIn.css i przenieśliśmy style do środka

function LogIn({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        setError(""); // Wyczyść stare błędy

        try {
            const response = await fetch("https://localhost:7130/api/Auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
                credentials: "include", // Niezbędne do wysyłania/odbierania ciasteczek
            });

            const data = await response.json();

            if (!response.ok) {
                // 🔑 POPRAWKA: Jeśli serwer zwrócił błąd (np. 401, 500), 
                // odczytujemy komunikat błędu z 'data.error'
                throw new Error(data.error || `Błąd serwera: ${response.status}`);
            }

            // Sukces (status 200 OK)
            console.log("Zalogowano:", data);
            onLogin(data); // Przekaż dane użytkownika (username, role) do App.jsx

        } catch (err) {
            console.error("Błąd logowania:", err);

            // 🔑 POPRAWKA: Wyświetlamy szczegółowy błąd, który otrzymaliśmy z serwera
            if (err.message.includes("Failed to fetch")) {
                // 🔑 NOWA, BARDZIEJ SZCZEGÓŁOWA WIADOMOŚĆ
                setError("BŁĄD SIECI (Failed to fetch): Nie można połączyć się z serwerem. \n1. Upewnij się, że serwer ASP.NET jest uruchomiony. \n2. Sprawdź, czy adres w przeglądarce (klient) jest dodany do CORS w Program.cs. \n3. (Jeśli używasz HTTPS) Spróbuj otworzyć https://localhost:7130 w nowej karcie i zaakceptuj certyfikat SSL.");
            } else {
                setError(err.message || "Nieznany błąd podczas logowania.");
            }
        }
    };

    // ... (style i reszta komponentu bez zmian) ...
    // Style inline
    const styles = {
        logInPanel: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 'auto',
            marginTop: '100px',
            padding: '40px 50px',
            width: '100%',
            maxWidth: '500px',
            background: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            fontFamily: 'Arial, sans-serif'
        },
        header: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '9px',
            width: '100%',
            marginBottom: '30px'
        },
        text: {
            color: '#007bff',
            fontSize: '32px',
            fontWeight: 'bold'
        },
        underline: {
            width: '100px',
            height: '4px',
            background: '#007bff',
            borderRadius: '9px'
        },
        inputs: {
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            width: '100%'
        },
        input: {
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            height: '50px',
            background: '#f4f4f4',
            borderRadius: '8px'
        },
        inputField: {
            height: '50px',
            width: '100%',
            background: 'transparent',
            border: '1px solid #ddd',
            outline: 'none',
            borderRadius: '8px',
            color: '#333',
            fontSize: '16px',
            padding: '0 20px'
        },
        buttonContainer: {
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            marginTop: '30px'
        },
        button: {
            width: '100%',
            padding: '12px 0',
            color: '#ffffff',
            background: '#007bff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background 0.3s'
        },
        errorText: {
            color: 'red',
            marginTop: '20px',
            textAlign: 'center',
            // 🔑 NOWY STYL: Pozwól na łamanie linii
            whiteSpace: 'pre-line'
        }
    };

    return (
        <div style={styles.logInPanel}>
            <div style={styles.header}>
                <div style={styles.text}>Zaloguj się</div>
                <div style={styles.underline}></div>
            </div>
            <div style={styles.inputs}>
                <div style={styles.input}>
                    <input
                        style={styles.inputField}
                        type="text"
                        placeholder="Nazwa użytkownika"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                </div>
                <div style={styles.input}>
                    <input
                        style={styles.inputField}
                        type="password"
                        placeholder="Hasło"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                </div>
            </div>
            <div style={styles.buttonContainer}>
                <button
                    style={styles.button}
                    onClick={handleLogin}
                    // Zmiana hover przy użyciu JavaScript
                    onMouseOver={(e) => e.currentTarget.style.background = '#0056b3'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#007bff'}
                >
                    Zaloguj się
                </button>
            </div>
            {error && <p style={styles.errorText}>{error}</p>}
        </div>
    );
}

export default LogIn;