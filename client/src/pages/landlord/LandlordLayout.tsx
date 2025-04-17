import React from 'react'
import { Outlet } from 'react-router-dom'
import LandlordSidebar from './LandlordSidebar'
// import LandlordNavbar from './LandlordNavbar'
import { useDarkMode } from '@/context/ThemeContext'
import LadnlordNavbar from './LadnlordNavbar'

const LandlordLayout = () => {
    const { darkMode } = useDarkMode()

    return (
        <div
            className={`flex min-h-screen ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                }`}
        >
            {/* Sidebar */}
            {/* <div
                className={`${darkMode ? 'bg-gray-900' : 'bg-indigo-600'
                    } w-64 h-full p-4 shadow-md`}
            >
                <LandlordSidebar />
            </div> */}

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Navbar */}
                <LadnlordNavbar />

                {/* Main content area */}
                <main className="flex-1 p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default LandlordLayout
