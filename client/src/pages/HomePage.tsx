



import { Button } from "../../src/components/ui/button";
import { Card, CardContent } from "../../src/components/ui/card";
import { Input } from "../../src/components/ui/input";
import { Badge } from "../../src/components/ui/badge";
import { Separator } from "../../src/components/ui/separator";
import { RocketIcon, StarIcon, GlobeIcon, HomeIcon, PhoneIcon, MailIcon, MenuIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, Sun, Moon, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../src/redux/store";
const HomePage = () => {
    const navigate = useNavigate();
    const landlord = useSelector((state: RootState) => state.auth.landlord)
    console.log("landlord state:", landlord);
    const [darkMode, setDarkMode] = useState(false)
    const handleClick = () => {
        if (landlord) {
            navigate('/landlord');
        } else {
            navigate('/landlord/login');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-blue-100 p-8">
            <div className="max-w-7xl mx-auto">
                <nav className="w-full px-6 py-4 bg-gradient-to-r from-blue-400 to-blue-500 shadow-lg text-white mb-10">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">


                        <div className="flex items-center gap-2">
                            <HomeIcon className="w-6 h-6 text-white" />
                            <span className="text-2xl font-bold tracking-wide">RentalNest</span>
                        </div>

                        <div className="hidden md:flex items-center gap-1">

                            <Button variant="ghost" className="text-white hover:text-yellow-300">Home</Button>
                            <Button variant="ghost" className="text-white hover:text-yellow-300">Services</Button>
                            <Button variant="ghost" className="text-white hover:text-yellow-300">About</Button>
                            <Button
                                className="bg-white text-blue-700 hover:bg-yellow-300 hover:text-black transition rounded-full px-5"
                                onClick={() => navigate('/landlord/login')}
                            >
                                Login
                            </Button>

                        </div>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2 rounded-full bg-gray-300 dark:bg-gray-600"
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <div className="md:hidden">
                            <MenuIcon className="w-6 h-6" />
                        </div>
                    </div>

                </nav>


                <motion.div
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-bold text-blue-900 mb-4">
                        Discover Your <span className="text-blue-600 mb-10">Dream Rental</span>
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Search and manage rental properties with ease. For landlords, tenants & agents.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {["Verified Listings", "Fast Booking", "Nationwide Access"].map((text, i) => (
                        <motion.div
                            key={text}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                        >
                            <Card className="rounded-2xl shadow-md hover:shadow-xl transition-all">
                                <CardContent className="p-6 text-center">
                                    <div className="flex justify-center mb-4">
                                        {i === 0 && <HomeIcon className="w-8 h-8 text-yellow-500" />}
                                        {i === 1 && <RocketIcon className="w-8 h-8 text-green-500" />}
                                        {i === 2 && <GlobeIcon className="w-8 h-8 text-red-500" />}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">{text}</h3>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Experience lightning-fast booking with just a few clicks — no delays, no hassle, just go!                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}

                </div>
                <div className="flex justify-center">

                    <Button onClick={handleClick} className="bg-yellow-400 text-black hover:bg-yellow-500 font-semibold px-6 rounded-full shadow-md">
                        Get Started
                    </Button>
                </div>

                <section className="py-16 bg-gray-50">
                    <h3 className="text-3xl font-semibold text-center mb-10">What Our Users Say</h3>
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
                        <Card className="flex-1 p-4">
                            <CardContent>
                                <p>"This is the best rental experience I’ve had. Super fast!"</p>
                                <Separator className="my-4" />
                                <p className="text-sm text-gray-600">- Priya, Pune</p>
                            </CardContent>
                        </Card>
                        <Card className="flex-1 p-4">
                            <CardContent>
                                <p>"I found a lovely apartment for my family within days."</p>
                                <Separator className="my-4" />
                                <p className="text-sm text-gray-600">- Rahul, Mumbai</p>
                            </CardContent>
                        </Card>
                    </div>
                </section>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl p-10 shadow-xl text-center"
                >
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Join the Shadify Community</h2>
                    <Separator className="my-4" />
                    <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
                        <Input placeholder="Enter your email" className="max-w-sm" />
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">Subscribe</Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                        Get updates, exclusive listings, and expert tips in your inbox.
                    </p>
                </motion.div>

                <footer className="mt-24 bg-indigo-500 text-white p-10 rounded-t-2xl">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h4 className="text-lg font-semibold mb-3">Shadify Rentals</h4>
                            <p className="text-sm text-indigo-100">
                                Manage and discover rental homes with a trusted and beautiful platform.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-3">Navigation</h4>
                            <ul className="text-sm space-y-2 text-indigo-100">
                                <li><a href="#" className="hover:underline">Home</a></li>
                                <li><a href="#" className="hover:underline">Login</a></li>
                                <li><a href="#" className="hover:underline">Register</a></li>
                                <li><a href="#" className="hover:underline">Dashboard</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-3">Contact</h4>
                            <p className="text-sm text-indigo-100">
                                <MailIcon className="inline w-4 h-4 mr-2" /> support@skillhub.com<br />
                                <PhoneIcon className="inline w-4 h-4 mr-2" /> +91 9284123374
                            </p>
                        </div>
                    </div>
                    <Separator className="my-6 bg-indigo-700" />
                    <p className="text-center text-sm text-indigo-200">
                        © {new Date().getFullYear()} Shadify Rentals. All rights reserved.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default HomePage;
