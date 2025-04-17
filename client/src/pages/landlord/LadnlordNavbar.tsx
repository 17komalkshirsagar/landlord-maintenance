import { Search, Sun, Moon, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useDarkMode } from "@/context/ThemeContext";
// import { useDarkMode } from "@/context/ThemeContext";

const navItems = [
    { title: "Property", links: [{ label: "Properties", path: "/landlord/property/table" }, { label: "Add Property", path: "/landlord/property" },] },
    { title: "Tax", links: [{ label: "Taxes", path: "/landlord/tax/table" }, { label: "Add Tax", path: "/landlord/tax" }] },
    { title: "Bill", links: [{ label: "Bills", path: "/landlord/bill/table" }, { label: "Add Bill", path: "/landlord/bill" }] },
    { title: "Maintainence", links: [{ label: "Maintainence", path: "/landlord/maintenance/table" }, { label: "Add Maintainence", path: "/landlord/maintenance" }] },
    { title: "Lease", links: [{ label: "Lease", path: "/landlord/lease/table" }, { label: "Add Lease", path: "/landlord/lease" }] },
    { title: "Contract", links: [{ label: "Contract", path: "/landlord/contract/table" }, { label: "Add Contract", path: "/landlord/contract" }] },
    { title: "Rental", links: [{ label: "Rental", path: "/landlord/rental/table" }, { label: "Add Rental", path: "/landlord/rental" }] },
    { title: "Tenant", links: [{ label: "Tenant", path: "/landlord/tenant/table" }, { label: "Add Tenant", path: "/landlord/tenant" }] },
];

const LadnlordNavbar = () => {
    const { darkMode, toggleDarkMode } = useDarkMode();
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
        navigate("/landlord/logout");
    };

    return (
        <header className={`p-4 flex justify-between items-center shadow-md ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
            <h1 className="text-lg font-bold">Landlord</h1>

            <div className="flex items-center gap-6 ml-auto">
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

                <div className="relative">
                    <Search className="absolute left-2 top-2.5 text-gray-500" size={18} />
                    <Input
                        type="text"
                        placeholder="Search..."
                        className="pl-8 w-64 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full bg-gray-300 dark:bg-gray-600"
                >
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <button onClick={handleLogoutClick} className="text-red-500 hover:text-red-600">
                    Logout
                </button>
            </div>
        </header>
    );
};

export default LadnlordNavbar;
