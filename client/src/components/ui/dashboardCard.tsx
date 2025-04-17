import React from "react";

interface DashboardCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
            <div className="p-3 bg-blue-100 rounded-full text-blue-500">{icon}</div>
            <div className="ml-4">
                <h4 className="text-lg font-semibold text-gray-700">{title}</h4>
                <p className="text-xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
};

export default DashboardCard;
