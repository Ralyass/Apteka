impport React, { useEffect, useState } from "react";
import axios from "axios"; 
import { useEffect } from "react";

const icons = {
    expiry: "⏰",       
    lowstock: "⚠️",
    system: "❗"
};

function Alerts() {

    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("https://localhost:7130/api/Alerts")
            .then(res => setAlerts(res.data))
            .catch(err => {
                console.error("Błąd pobierania alertów:", err)
                    .finally(() => setLoading(false));
            }, []);

        if (loading) return <div>Ładowanie powiadomień...</div>;
        if (alerts.length === 0) return <div>Brak powiadomień.</div>;

        return (
            <div className="alerts-list">
                {alerts.map((alert, idx) => (
                    <div
                        key={idx}
                        className={`alert alert-${alert.type}`}
                        style={{
                            border: "1px solid #e0e0e0",
                            padding: "10px 18px",
                            margin: "7px 0",
                            borderRadius: "8px",
                            background: alert.type === "expiry" ? "#fffbe5"
                                : alert.type === "lowstock" ? "#ffeaea"
                                    : "#e6f7ff",
                            color: "#2d3648",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px"
                        }}
                    >
                        <span style={{ fontSize: "1.4em" }}>{icons[alert.type] || "ℹ️"}</span>
                        <span>{alert.message}</span>
                    </div>
                ))}
            </div>
        );
}

export default Alerts;

