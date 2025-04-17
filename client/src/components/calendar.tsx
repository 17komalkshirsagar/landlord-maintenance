import React from 'react'
import { Calendar } from './ui/calendar'

const CalendarPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            {/* Calendar Wrapper */}
            <div className="w-full max-w-4xl p-10">
                <Calendar className="w-full scale-125" />
            </div>
        </div>
    )
}

export default CalendarPage
