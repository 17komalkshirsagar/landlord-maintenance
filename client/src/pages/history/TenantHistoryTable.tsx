import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import TableData from '../../components/TableData';
import { useDeleteTenantHistoryMutation, useGetAllTenantHistoryQuery } from '../../redux/api/tenantHistory.api';

const TenantHistoryTable = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    const navigate = useNavigate();

    const { data: tenantHistoryData, isLoading } = useGetAllTenantHistoryQuery({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        isFetchAll: false,
        search: searchQuery,
    });
    const [deleteTenantHistory] = useDeleteTenantHistoryMutation();
    const handleDeleteTenantHistory = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this delete Tenant History?')) {
            try {
                await deleteTenantHistory(id).unwrap();
                alert('delete Tenant History deleted successfully!');
            } catch (err) {
                console.error('Delete failed:', err);
                alert('Failed to delete contract.');
            }
        }
    };
    const columns = [
        {
            accessorKey: 'property.name',
            header: 'Property',
            cell: (info: any) => info.getValue() || 'N/A',
        },

        {
            accessorKey: 'tenant.name',
            header: 'Tenant Name',
            cell: (info: any) => info.getValue() || 'N/A',
        },
        {
            accessorKey: 'startDate',
            header: 'Start Date',
            cell: (info: any) => new Date(info.getValue()).toLocaleDateString(),
        },
        {
            accessorKey: 'endDate',
            header: 'End Date',
            cell: (info: any) => info.getValue() ? new Date(info.getValue()).toLocaleDateString() : 'Ongoing',
        },
        {
            header: 'Actions',
            cell: (info: any) => {
                const row = info.row.original;
                return (
                    <div className="flex gap-4">
                        <button
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={() => navigate(`/tenanthistory/${row._id}`)}
                        >
                            Edit
                        </button>
                        <button
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={() => navigate(`/tenanthistory/view/${row._id}`)}
                        >
                            View
                        </button>



                        <button
                            onClick={() => handleDeleteTenantHistory(row._id)}
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
                    <h2 className="text-lg font-bold text-gray-900">Tenant History</h2>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 flex justify-between gap-5">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="block w-72 h-10 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                </div>
            </div>

            <div className="mt-8 flow-root">
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        {tenantHistoryData && (
                            <TableData
                                data={tenantHistoryData?.result || []}
                                columns={columns}
                                enableSorting={true}
                                onPaginationChange={setPagination}
                                enableGlobalFilter={true}
                                onGlobalFilterChange={searchQuery}
                                initialPagination={pagination}
                                totalPages={tenantHistoryData?.pagination?.totalPages}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TenantHistoryTable;
