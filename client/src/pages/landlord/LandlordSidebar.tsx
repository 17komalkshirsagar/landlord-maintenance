import { useState } from "react"
import {
    Calendar,
    Home,
    Building,
    Users,
    Settings,
    FileText,
    Receipt,
    ScrollText,
    BookText,
    Menu, UserCog,
    X,
} from "lucide-react"
import { NavLink } from "react-router-dom"
import { cn } from "../../lib/utils"

const navItems = [

    { label: "Dashboard", icon: Home, to: "/landlord" },
    { label: "Calendar", icon: Calendar, to: "/landlord/calendar" },
    { label: "Maintenance ", icon: UserCog, to: "/landlord/maintenance " },
    { label: "Properties", icon: Building, to: "/landlord/property" },
    { label: "Tenants", icon: Users, to: "/landlord/tenant" },
    { label: "Bill", icon: Receipt, to: "/landlord/bill" },
    { label: "Tax", icon: FileText, to: "/landlord/tax" },
    { label: "Tenants History", icon: Users, to: "/landlord/tenanthistory" },
    { label: "Lease", icon: ScrollText, to: "/landlord/lease" },
    { label: "Agreement", icon: BookText, to: "/landlord/rental" }


]

const LandlordSidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <>

            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="fixed top-4 left-4 z-50 bg-white p-2 rounded shadow"
            >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div
                className={cn(
                    "fixed top-0 left-0 h-full w-64 bg-white shadow-lg transition-transform duration-300 z-40 flex flex-col justify-between",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="p-4">
                    <h2 className="text-2xl font-bold mb-6">Landlord Panel</h2>
                    <nav className="space-y-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.label}
                                to={item.to}
                                onClick={() => setIsSidebarOpen(false)}
                                className={({ isActive }) =>
                                    cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition",
                                        isActive
                                            ? "bg-muted text-primary"
                                            : "text-muted-foreground hover:bg-muted hover:text-primary"
                                    )
                                }
                            >
                                <item.icon className="w-4 h-4" />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Settings at the bottom */}
                <div className="p-4">
                    <NavLink
                        to="/landlord/settings"
                        onClick={() => setIsSidebarOpen(false)}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition",
                                isActive
                                    ? "bg-muted text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-primary"
                            )
                        }
                    >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                    </NavLink>
                </div>
            </div>
        </>
    )
}

export default LandlordSidebar
