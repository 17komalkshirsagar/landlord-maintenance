import { useState } from "react"
import { Calendar, Home, Inbox, Search, Settings, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet"
import { cn } from "../../../client/src/lib/utils";
import { Button } from "../components/ui/button"

const items = [
    { title: "Home", url: "#", icon: Home },
    { title: "Inbox", url: "#", icon: Inbox },
    { title: "Calendar", url: "#", icon: Calendar },
    { title: "Search", url: "#", icon: Search },
    { title: "Settings", url: "#", icon: Settings },
]





export const Sidebar = () => {
    const [open, setOpen] = useState(false)
    return <>
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" className="m-2">
                    <Menu className="w-5 h-5" />
                </Button>
            </SheetTrigger>
            <SheetContent className="w-64 bg-white fixed left-0 top-0 h-full shadow-lg">
                <div className="p-4">
                    <h2 className="text-lg font-bold mb-4">Application</h2>
                    <nav className="space-y-2">
                        {items.map((item) => (
                            <a
                                key={item.title}
                                href={item.url}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-200 transition"
                                )}
                                onClick={() => setOpen(false)}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.title}</span>
                            </a>
                        ))}
                    </nav>
                </div>
            </SheetContent>

        </Sheet>
    </>
}
export default Sidebar;