import { Outlet } from "react-router-dom";
import Sidebar from "../pages/Sidebar";
import Navbar from "../pages/admin/AdminNavbar";


const DashboardLayout = () => {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1">
                <Navbar />
                <div className="p-4">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
