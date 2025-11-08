import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardCard from "../components/DashboardCard";
import "../styles/globals.css"
import medicines from "../assets/medicines.png"
import orders from "../assets/orders.png"
import sales from "../assets/sales.png"
import users from "../assets/users.png"


function Dashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalMedicines: 0,
        totalOrders: 0,
        totalSales: 0,
    });

    useEffect(() => {
        axios.get("http://localhost:5285/api/Dashboard/stats")
            .then(res => {
                console.log("📦 Dane z API:", res.data);
                setStats(res.data);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="dashboard-container">
            <h2>Panel administratora</h2>
            <div className="dashboard-grid">
                <DashboardCard title="Liczba użytkowników" value={stats.totalUsers} icon={users} />
                <DashboardCard title="Liczba leków" value={stats.totalMedicines} icon={medicines}/>
                <DashboardCard title="Zamówienia" value={stats.totalOrders} icon={orders}/>
                <DashboardCard
                    title="Sprzedaż (miesiąc)"
                    value={`${(stats.totalSales ?? 0).toLocaleString()} zł`}
                    icon={sales}
                />
            </div>
        </div>
    );
}

export default Dashboard

