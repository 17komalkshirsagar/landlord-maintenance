import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import TableData from '../../components/TableData';
import { useApproveMaintenanceRequestMutation, useCompleteMaintenanceRequestMutation, useDeleteMaintenanceRequestMutation, useGetAllMaintenanceRequestsQuery } from '../../redux/api/maintance.api';

const MaintenanceTable = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    const navigate = useNavigate();

    const { data: maintenanceData, isLoading } = useGetAllMaintenanceRequestsQuery({
        search: searchQuery.trim(),
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
    });

    const [deleteMaintenance] = useDeleteMaintenanceRequestMutation();
    const [completeMaintenance] = useCompleteMaintenanceRequestMutation();
    const [approveRequest] = useApproveMaintenanceRequestMutation();
    console.log("approveRequest:", approveRequest);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this request?')) {
            try {
                await deleteMaintenance(id).unwrap();
                alert('Maintenance request deleted!');
            } catch (err) {
                console.error(err);
                alert('Delete failed.');
            }
        }
    };

    const handleComplete = async (id: string) => {
        if (window.confirm('Mark this request as completed?')) {
            try {
                await completeMaintenance(id).unwrap();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await approveRequest(id).unwrap();
            console.log("Approved successfully:", approveRequest)
        } catch (err) {
            console.log("Approval failed.");
        }
    }
    const columns = [
        {
            accessorKey: 'tenant.name',
            header: 'Tenant Name',
            cell: (info: any) => info.getValue() || 'N/A',
        },

        {
            accessorKey: 'property.name',
            header: 'Property',
            cell: (info: any) => info.row.original?.property?.name || 'N/A',
        },

        {
            accessorKey: 'description',
            header: 'Description',
            cell: (info: any) => info.getValue(),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: (info: any) => info.getValue(),
        },
        {
            header: 'Actions',
            cell: (info: any) => {
                const row = info.row.original;
                return (

                    <div className="flex gap-4">
                        <button
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={() => navigate(`/landlord/maintenance/${row._id}`)}
                        >
                            Edit
                        </button>

                        {row.status === "pending" && (
                            <button
                                onClick={() => handleApprove(row._id)}
                                className="text-yellow-600 hover:text-yellow-800"
                            >
                                Approve
                            </button>
                        )}

                        {(row.status === "inProgress" || row.status === "approved") && (
                            <button
                                onClick={() => handleComplete(row._id)}
                                className="text-green-600 hover:text-green-800"
                            >
                                Complete
                            </button>
                        )}
                        {row.status === "completed" && (
                            <span className="text-gray-400 cursor-not-allowed">Completed</span>
                        )}
                        <button
                            onClick={() => handleDelete(row._id)}
                            className="text-red-600 hover:text-red-800"
                        >
                            Delete
                        </button>
                    </div>

                );
            },
        },
    ];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen -mt-20">
                <Loader size={16} />
            </div>
        );
    }

    return (
        <div>
            <div className="sm:flex sm:items-center justify-center">
                <div className="sm:flex-auto">
                    <h2 className="text-lg font-bold text-gray-900">Maintenance Requests</h2>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 flex justify-between gap-5">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="block w-72 h-10 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                    <button
                        type="button"
                        className="block rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                        onClick={() => navigate('/landlord/maintenance')}
                    >
                        Add Request
                    </button>
                </div>
            </div>

            <div className="mt-8 flow-root">
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        {maintenanceData &&
                            <TableData
                                data={maintenanceData?.result || []}
                                columns={columns}
                                enableSorting={true}
                                onPaginationChange={setPagination}
                                enableGlobalFilter={true}
                                onGlobalFilterChange={searchQuery}
                                initialPagination={pagination}
                                totalPages={maintenanceData?.pagination?.totalPages}
                            />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceTable;
