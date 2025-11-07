import React from "react";

import logo from "../assets/logo.png"
function Navbar({ user }) {

    //const Navbar = () => {
    //    const user = localStorage.getItem("user");
    //}

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/";
    }

    return (
        <nav className="navbar"  >
            <img src={logo} alt="logo" />
            <div className="nav-right" style={{float: "right"} }>
                <span>Zalogowno jako: <strong>{user}</strong></span>
                <button onClick={handleLogout}>Wyloguj</button>
            </div>
        </nav>

    );


}
export default Navbar