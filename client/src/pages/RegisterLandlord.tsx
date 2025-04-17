import React from "react";

const LandlordRegister = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Landlord Register</h2>
                <input type="text" placeholder="Name" className="w-full p-2 border rounded mb-4" />
                <input type="email" placeholder="Email" className="w-full p-2 border rounded mb-4" />
                <button className="w-full bg-green-600 text-white p-2 rounded">Register</button>
            </div>
        </div>
    );
};

export default LandlordRegister;