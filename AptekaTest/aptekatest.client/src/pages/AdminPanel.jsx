import Dashboard from "./Dashboard.jsx";
import Navbar from "../components/Navbar";
import _Sidebar from "../components/_Sidebar.jsx"
import '../styles/AdminPanel.css';

function AdminPanel() {
    return (
        <>
            <Navbar user="Admin" />
            <_Sidebar role="admin" />
            <div className="app-container">
                <div className="content">
                    <Dashboard />
                </div>
            </div>
          
        </>
    );
}
export default AdminPanel;
