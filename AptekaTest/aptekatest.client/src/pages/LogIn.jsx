import { useState } from "react";
import "../styles/LogIn.css";

function LogIn({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            const response = await fetch("https://localhost:7130/api/Auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const text = await response.text(); 
                console.error("Błąd logowania:", text);
                setError("Błąd logowania: " + text);
                return;
            }

            // jeśli status ok (200)
            const data = await response.json();
            localStorage.setItem("user", data.username);
            console.log("Zalogowano:", data);
            onLogin(data);

        } catch (err) {
            console.error("Błąd połączenia:", err);
            setError("Błąd połączenia z serwerem: " + err.message);
        }
    };

    return (
        <div className="LogInPanel">
            <div className="header">
                <div className="text">Zaloguj się</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <div className="input">
                    <input
                        type="text"
                        placeholder="Nazwa użytkownika"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="input">
                    <input
                        type="password"
                        placeholder="Hasło"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>
            <div className="button">
                <button onClick={handleLogin}>Zaloguj się</button>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default LogIn;
