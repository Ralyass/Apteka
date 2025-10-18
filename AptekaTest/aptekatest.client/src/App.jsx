import { useState } from "react";
import LogIn from "./LogIn";
import AdminPanel from "./AdminPanel";
import FarmaceutaPanel from "./FarmaceutaPanel";
import KierownikPanel from "./KierownikPanel";

function App() {
    const [user, setUser] = useState(null);

    const handleLogin = (data) => {
        setUser(data);
    };

    if (!user) {
        return <LogIn onLogin={handleLogin} />;
    }

    switch (user.username) {
        case "Admin":
            return <AdminPanel username={user.username} />;
        case "farmaceuta1":
            return <FarmaceutaPanel username={user.username} />;
        case "kierownik1":
            return <KierownikPanel username={user.username} />;
        default:
            return <p>Nieznany użytkownik</p>;
    }
}

export default App;
