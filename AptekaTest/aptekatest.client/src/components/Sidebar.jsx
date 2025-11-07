import React from "react";
import "../styles/globals.css";
function Sidebar({ role }) {
    const links = {
        Admin: [
            { label: "Użytkownicy", href:"/users" },
            { label: "Leki", href:"/medicines" },
            { label: "Raporty", href:"/reports" },
        ],
        Menager: [
            { label: "Magazyn", href:"/medicines" },
            { label: "Zamowienia", href:"/reports" },
        ],
        Employee: [
            { label: "Wydawanie leków", href:"/users" },
            { label: "Leki", href:"/medicines" },
            { label: "Dostawy", href:"/reports" },
        ],
    };

    const userLinks = links[role] || [];

    return (
        <aside className="sidebar">
            <h3>Panel {role}</h3>
            <ul>
                {userLinks.map((link,index) => (
                    <li key={index}>
                        <a href={link.href}>{link.label}</a>
                    </li>
                ))}
            </ul>
        </aside>
    );
}

export default Sidebar