import Dashboard from "./Dashboard.jsx";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar"
function AdminPanel({ username }) {
    return (
        <>
            <Navbar user="Admin" />
            <div className="app-container">
                <div className="content">
                    <Dashboard />
                </div>
            <Sidebar role="Admin"/>
            </div>
        </>
    );
}
export default AdminPanel;
