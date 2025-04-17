import { Outlet } from "react-router-dom";
import Navbar from "../pages/admin/AdminNavbar";
import Sidebar from "../pages/Sidebar";


const LandlordLayout = () => {
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

export default LandlordLayout;
