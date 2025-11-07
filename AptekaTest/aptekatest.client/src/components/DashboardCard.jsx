import React from "react";


function DashboardCard({ title, value, icon }) {

    return (
        <div className="dashboard-card">
            <div className="icon">{icon}</div>
            <div>
                <h4>{title}</h4>
                <p>{value}</p>
            </div>
        </div>
    );

}

export default DashboardCard