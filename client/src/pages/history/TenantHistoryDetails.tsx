
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetAllTenantHistoryQuery } from '../../redux/api/tenantHistory.api';
import Loader from '../../components/Loader';
import { FaUser, FaMapMarkerAlt, FaFileAlt, FaCalendarAlt } from 'react-icons/fa';

const TenantHistoryDetail = () => {
    const { id } = useParams();
    const { data, isLoading } = useGetAllTenantHistoryQuery({
        page: 1,
        limit: 10,
        isFetchAll: true,
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Loader size={16} />
            </div>
        );
    }

    const tenantHistory = data?.result?.find((history: any) => history._id === id);

    if (!tenantHistory) {
        return (
            <div className="text-center text-red-500 mt-20 text-xl font-bold">Tenant history not found</div>
        );
    }

    const { property, tenant, startDate, endDate } = tenantHistory;

    return (
        <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
            {/* Title Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow-md">
                <h1 className="text-3xl font-bold">Tenant History Detail</h1>
                <p className="mt-1 text-sm text-blue-100">Track details of tenants and their rental agreements</p>
            </div>

            {/* Grid Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Property Card */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-blue-700">
                        <FaMapMarkerAlt /> Property Information
                    </h2>
                    <div className="mt-3 space-y-1 text-gray-700">
                        <p><strong>Name:</strong> {property?.name}</p>
                        <p><strong>Address:</strong> {property?.address}, {property?.city}, {property?.state} - {property?.zipCode}</p>
                        <p><strong>Type:</strong> {property?.type}</p>
                        <p><strong>Rent:</strong> ₹{property?.rentAmount}</p>
                    </div>


                    <div className="mb-8">

                        <h2 className="flex items-center gap-2 text-lg font-semibold text-blue-700">
                            <FaCalendarAlt /> History Period
                        </h2>
                        <div className="mt-3 space-y-1 text-gray-700">
                            <p><strong>Start Date:</strong> {new Date(startDate).toLocaleDateString()}</p>
                            <p><strong>End Date:</strong> {endDate ? new Date(endDate).toLocaleDateString() : 'Ongoing'}</p>
                        </div>
                    </div>
                </div>

                {/* Tenant Card */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-blue-700">
                        <FaUser /> Tenant Information
                    </h2>
                    <div className="mt-4 flex gap-4 items-center">
                        <img
                            src={`http://localhost:5003/galaxy/${tenant?.image}`}
                            alt={tenant?.name}
                            className="w-20 h-20 rounded-full ring-4 ring-indigo-500 object-cover"
                        />
                        <div>
                            <p className="text-lg font-bold">{tenant?.name}</p>
                            <p className="text-gray-500">{tenant?.mobile}</p>
                        </div>
                    </div>
                    <div className="mt-4 text-gray-700 space-y-1">
                        <p><strong>Lease Start:</strong> {new Date(tenant?.leaseStart).toLocaleDateString()}</p>
                        <p><strong>Lease End:</strong> {new Date(tenant?.leaseEnd).toLocaleDateString()}</p>
                        <p><strong>Rent:</strong> ₹{tenant?.rentAmount}</p>
                        <p><strong>Deposit:</strong> ₹{tenant?.securityDeposit}</p>
                        <p>
                            <strong>Status:</strong>
                            <span className="ml-2 inline-block bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
                                {tenant?.status}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Document Card */}
                {tenant?.documents?.length > 0 && (
                    <div className="bg-white p-6 rounded-xl shadow-md col-span-1 md:col-span-2">
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-blue-700">
                            <FaFileAlt /> Documents
                        </h2>
                        <div className="flex flex-wrap gap-4 mt-4">
                            {tenant.documents.map((doc: string, index: number) => (
                                <a
                                    key={index}
                                    href={`http://localhost:5003/galaxy/${doc}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-md text-sm font-medium transition"
                                >
                                    📎 {doc}
                                </a>
                            ))}
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
};

export default TenantHistoryDetail;
