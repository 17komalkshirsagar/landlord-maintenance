import { FiUsers, FiDollarSign, FiShoppingCart } from "react-icons/fi";

import { SidebarOpen } from "lucide-react";
const AdminDashboard = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <SidebarOpen />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">



                {/* Dashboard Content */}
                <div className="p-6">
                    <h2 className="text-2xl font-semibold text-gray-700">Dashboard</h2>



                    {/* Recent Activity Table */}
                    <div className="mt-8 bg-white shadow-md rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Orders</h3>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                                    <th className="py-2 px-4">Order ID</th>
                                    <th className="py-2 px-4">Customer</th>
                                    <th className="py-2 px-4">Amount</th>
                                    <th className="py-2 px-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t">
                                    <td className="py-2 px-4">#12345</td>
                                    <td className="py-2 px-4">John Doe</td>
                                    <td className="py-2 px-4">$120</td>
                                    <td className="py-2 px-4 text-green-600">Completed</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="py-2 px-4">#12346</td>
                                    <td className="py-2 px-4">Jane Smith</td>
                                    <td className="py-2 px-4">$200</td>
                                    <td className="py-2 px-4 text-yellow-600">Pending</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
