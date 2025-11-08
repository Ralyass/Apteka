import { useState } from "react";
import LogIn from "./pages/LogIn.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import FarmaceutaPanel from "./pages/FarmaceutaPanel.jsx";
import KierownikPanel from "./pages/KierownikPanel.jsx";

function App() {
    const [user, setUser] = useState(null);

    const handleLogin = (data) => {
        setUser(data);
    };

    if (!user) {
        return <LogIn onLogin={handleLogin} />;
    }

    switch (user.username) {
        case "admin":
            return <AdminPanel username={user.username} />;
        case "farmaceuta":
            return <FarmaceutaPanel username={user.username} />;
        case "kierownik":
            return <KierownikPanel username={user.username} />;
        default:
            return <p>Nieznany użytkownik</p>;
    }
}

export default App;
