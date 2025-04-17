import { Search, Sun, Moon, ChevronDown } from "lucide-react";

import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const navItems = [
    {
        title: "Property",
        links: [
            { label: "Properties", path: "/property/table" },
            { label: "Add Property", path: "/property" },
        ],
    },
    {
        title: "Tax",
        links: [
            { label: "Taxes", path: "/tax/table" },
            { label: "Add Tax", path: "/tax" },
        ],
    },
    {
        title: "Bill",
        links: [
            { label: "Bills", path: "/bill/table" },
            { label: "Add Bill", path: "/bill" },
        ],
    },
    {
        title: "Maintainence",
        links: [
            { label: "Maintainence", path: "/maintenance/table" },
            { label: "Add Maintainence", path: "/maintenance" },
        ],
    },
    {
        title: "Lease",
        links: [
            { label: "Lease", path: "/lease/table" },
            { label: "Add Lease", path: "/lease" },
        ],
    },
    {
        title: "Contract",
        links: [
            { label: "Contract", path: "/contract/table" },
            { label: "Add Contract", path: "/contract" },
        ],
    },
    {
        title: "Rental",
        links: [
            { label: "Rental", path: "/rental/table" },
            { label: "Add Rental", path: "/rental" },
        ],
    },
    {
        title: "Tenant",
        links: [
            { label: "Tenant", path: "/tenant/table" },
            { label: "Add Tenant", path: "/tenant" },
        ],
    },
];

const AdminNavbar = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const navigate = useNavigate();
    const handleMouseEnter = (title: string) => {
        if (timeoutId) clearTimeout(timeoutId);
        setActiveMenu(title);
    };

    const handleMouseLeave = () => {
        const id = setTimeout(() => setActiveMenu(null), 150);
        setTimeoutId(id);
    };


    const handleLogoutClick = () => {
        navigate("/admin/logout");
    };
    return (
        <header className={`p-4 flex justify-between items-center shadow-md ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
            <h1 className="text-lg font-bold">Admin Navbar</h1>

            <nav className="flex items-center gap-6">
                {navItems.map(({ title, links }) => (
                    <div
                        key={title}
                        className="relative"
                        onMouseEnter={() => handleMouseEnter(title)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button className="flex items-center gap-1 font-medium hover:text-blue-600">
                            {title} <ChevronDown size={16} />
                        </button>
                        <div
                            className={`absolute top-full left-0 mt-2 bg-white text-black shadow-lg rounded-lg w-40 z-50 p-2 space-y-2 transition-all duration-200 ease-in-out transform dark:bg-gray-700 dark:text-white ${activeMenu === title ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                                }`}
                        >
                            {links.map(({ label, path }) => (
                                <Link key={label} to={path} className="block hover:text-blue-500">
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
                <button onClick={handleLogoutClick} className="text-red-500 hover:text-red-600">
                    Logout
                </button>
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 text-gray-500" size={18} />
                    <Input
                        type="text"
                        placeholder="Search..."
                        className="pl-8 w-64 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 rounded-full bg-gray-300 dark:bg-gray-600"
                >
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </nav>
        </header>
    );
};

export default AdminNavbar;
