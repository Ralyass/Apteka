import Cookies from 'js-cookie';
import { useEffect, useState } from "react";
import LogIn from "./pages/LogIn.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import FarmaceutaPanel from "./pages/FarmaceutaPanel.jsx";
import KierownikPanel from "./pages/KierownikPanel.jsx";

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loggedUser = Cookies.get('loggedUser');
        if (loggedUser) {
            setUser({ username: loggedUser });
        }
    }, []);

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
        <>
            <button onClick={handleLogout}>Wyloguj</button>
            {
                user.username === 'admin' ? <AdminPanel username={user.username} /> :
                user.username === 'farmaceuta' ? <FarmaceutaPanel username={user.username} /> :
                user.username === 'kierownik' ? <KierownikPanel username={user.username} /> :
                <p>Nieznany użytkownik</p>
            }
        </>
    );
}

export default App;
