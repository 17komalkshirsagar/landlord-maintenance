import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import TableData from '../../components/TableData';
import { useGetAllTenantsQuery, useDeleteTenantMutation } from '../../redux/api/tenant.api';

const TenantTable = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const navigate = useNavigate();

    const { data: tenants, isLoading } = useGetAllTenantsQuery({
        search: searchQuery?.trim(),
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
    });
    console.log(tenants);

    const [deleteTenant] = useDeleteTenantMutation();

    const handleDeleteTenant = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this tenant?")) {
            try {
                await deleteTenant(id).unwrap();
            } catch (error) {
                console.error("Failed to delete tenant:", error);
            }
        }
    };

    const columns = [
        {
            header: 'Name',
            accessorKey: 'name',
        },
        {
            header: 'Mobile',
            accessorKey: 'mobile',
        },
        {
            header: 'Lease Start',
            accessorKey: 'leaseStart',
            cell: (info: any) => new Date(info.getValue()).toLocaleDateString(),
        },
        {
            header: 'Lease End',
            accessorKey: 'leaseEnd',
            cell: (info: any) => new Date(info.getValue()).toLocaleDateString(),
        },
        {
            header: 'Rent Amount',
            accessorKey: 'rentAmount',
            cell: (info: any) => `₹${info.getValue()}`,
        },
        {
            header: 'Image',
            accessorKey: 'image',
            cell: ({ row }: any) => (
                <img
                    src={row.original.image}
                    alt="Tenant"
                    className="w-12 h-12 rounded-full object-cover"
                />
            ),
        },
        {
            header: 'Documents',
            accessorKey: 'documents',
            cell: ({ row }: any) => (
                <a
                    href={row.original.documents}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                >
                    View
                </a>
            ),
        },
        {
            header: 'Security Deposit',
            accessorKey: 'securityDeposit',
            cell: (info: any) => `₹${info.getValue()}`,
        },
        {
            header: 'Status',
            accessorKey: 'status',
        },
        {
            header: 'Actions',
            cell: (info: any) => {
                const row = info.row.original;
                return (
                    <div className="space-x-2">
                        <button
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={() => navigate(`/landlord/tenant/${row._id}`)}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDeleteTenant(row._id)}
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
            <div className="flex justify-center items-center h-screen">
                <Loader size={16} />
            </div>
        );
    }

    return (
        <div>
            <div className="sm:flex sm:items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Tenants</h2>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-72 h-10 rounded-md border px-3 py-1.5 text-base text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        type="button"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500"
                        onClick={() => navigate('/landlord/tenant')}
                    >
                        Add
                    </button>
                </div>
            </div>

            <div className="mt-8">
                <TableData
                    data={tenants?.result || []}
                    columns={columns}
                    enableSorting={true}
                    onPaginationChange={setPagination}
                    enableGlobalFilter={true}
                    onGlobalFilterChange={searchQuery}
                    initialPagination={pagination}
                    totalPages={tenants?.pagination?.totalPages}
                />
            </div>
        </div>
    );
};

export default TenantTable;
