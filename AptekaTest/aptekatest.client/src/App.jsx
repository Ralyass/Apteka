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

    useEffect(() => {
        const loggedUser = Cookies.get('loggedUser');
        console.log('loggedUser:', loggedUser);
        if (loggedUser) {
            setUser({ username: loggedUser });
        }
    }, []);

    console.log('userrr:', user); 

    const handleLogin = (data) => {
        setUser(data);
    };

    const handleLogout = () => {
        Cookies.remove('loggedUser');
        setUser(null);
        fetch('https://localhost:7130/api/auth/logout', { method: 'POST' });
    };

    if (!user) {
        return <LogIn onLogin={handleLogin} />;
    }

    return (
        <BrowserRouter>
            <button onClick={handleLogout}>Wyloguj</button>
            <Routes>
                {user.username === 'admin' && (
                    <>
                        <Route path="/" element={<AdminPanel username={user.username} />} />
                        <Route path="/users" element={<AdminUsers />} />
                        {/* inne admin route'y */}
                    </>
                )}
                {user.username === 'farmaceuta' && (
                    <Route path="/" element={<FarmaceutaPanel username={user.username} />} />
                )}
                {user.username === 'kierownik' && (
                    <Route path="/" element={<KierownikPanel username={user.username} />} />
                )}
                {/* fallback na wypadek błędnej roli */}
                <Route path="*" element={<p>Nieznany użytkownik </p>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
