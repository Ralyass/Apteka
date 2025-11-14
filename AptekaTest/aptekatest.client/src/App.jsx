import Cookies from 'js-cookie';
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LogIn from "./pages/LogIn.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import FarmaceutaPanel from "./pages/FarmaceutaPanel.jsx";
import KierownikPanel from "./pages/KierownikPanel.jsx";
import AdminUsers from "./components/AdminUsers";

function App() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const response = await fetch('https://localhost:7130/api/Auth/checkauth', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Błąd podczas sprawdzania sesji użytkownika:', error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        checkUserSession();
    }, []);


    const handleLogin = (data) => {
        setUser(data);
    };

    const handleLogout = async () => {
        try {
            await fetch('https://localhost:7130/api/Auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Błąd podczas wylogowywania:', error);
        } finally {
            setUser(null);
            Cookies.remove('loggedUser');
        }
    };

    if (isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Ładowanie...</div>;
    }

    if (!user) {
        return <LogIn onLogin={handleLogin} />;
    }
    console.log('Zalogowany użytkownik:', user); 

    return (
        <BrowserRouter>
            <button onClick={handleLogout}>Wyloguj</button>
            <Routes>
                {user.role === 'Admin' && (
                    <>
                        <Route path="/" element={<AdminPanel username={user.username} />} />
                        <Route path="/users" element={<AdminUsers />} />
                        {/* inne admin route'y */}
                    </>
                )}
                {user.role === 'Farmaceuta' && (
                    <Route path="/" element={<FarmaceutaPanel username={user.username} />} />
                )}
                {user.role === 'Kierownik' && (
                    <Route path="/" element={<KierownikPanel username={user.username} />} />
                )}
                <Route path="*" element={<p>Nie masz uprawnień lub rola jest nieznana: {user.role}</p>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
