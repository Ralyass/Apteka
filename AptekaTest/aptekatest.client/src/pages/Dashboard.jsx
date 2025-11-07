import React from "react";

import DashboardCard from "../components/DashboardCard";
import "../styles/globals.css"

function Dashboard() {
    const stats = [
        { title: "Liczba użytkowników", value: 3, icon: "<FaUserMd size={30}" },
        { title: "Liczba leków", value: 128, icon:" <FaPills size={30}"},
        { title: "Zamówienia", value: 24, icon: "<FaClipboardList size={30} "},
        { title: "Sprzedaż (miesiąc)", value: "12 430 zł", icon: "<FaChartLine size={30}" },
    ];

    return (
        <div className="dashboard-container">
            <h2>Panel administratora</h2>
            <div className="dashboard-grid">
                {stats.map((item, index) => (
                    <DashboardCard
                        key={index}
                        title={item.title}
                        value={item.value}
                        icon={item.icon}
                    />
                ))}
            </div>
        </div>
    );
}

export default Dashboard

