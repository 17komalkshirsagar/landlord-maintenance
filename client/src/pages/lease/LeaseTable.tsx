

import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Loader from '../../components/Loader';
import TableData from '../../components/TableData';
import { useDeleteLeaseMutation, useGetAllLeasesQuery, useTerminateLeaseMutation } from '../../redux/api/leases.api';

const LeaseTable = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });


    const navigate = useNavigate();
    const [deleteLease,] = useDeleteLeaseMutation();
    const [terminateLease] = useTerminateLeaseMutation();
    const { data: LeaseData, isLoading } = useGetAllLeasesQuery({
        search: searchQuery.trim(),
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,

    });
    console.log("LeaseData:", LeaseData);
    const handleDeleteLease = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this Contract?')) {
            try {
                await deleteLease(id).unwrap();
                alert('Contract deleted successfully!');
            } catch (err) {
                console.error('Delete failed:', err);
                alert('Failed to delete contract.');
            }
        }
    };
    const handleTerminateLease = async (id: string) => {
        if (window.confirm('Are you sure you want to terminate this lease?')) {
            try {
                await terminateLease(id).unwrap();
                alert('Lease terminated successfully!');
            } catch (err) {
                console.error('Termination failed:', err);
                alert('Failed to terminate lease.');
            }
        }
    };

    const columns = [
        {
            accessorKey: 'tenant.name',
            header: 'Tenant Name',
            cell: (info: any) => info.getValue(),
        },
        {
            accessorKey: 'terms',
            header: 'Terms',
            cell: (info: any) => info.getValue(),
        },
        {
            accessorKey: 'securityDeposit',
            header: 'Security Deposit',
            cell: (info: any) => info.getValue(),
        },
        {
            accessorKey: 'property.name',
            header: 'Property',
            cell: (info: any) => info.row.original?.property?.name || 'N/A',
        },
        {
            accessorKey: "startDate",
            header: 'Start Date',
            cell: (info: any) => {
                const dueDate = info.getValue();
                return dueDate ? new Date(dueDate).toLocaleDateString() : 'N/A';
            },
        },
        {
            accessorKey: "endDate",
            header: 'End Date',
            cell: (info: any) => {
                const dueDate = info.getValue();
                return dueDate ? new Date(dueDate).toLocaleDateString() : 'N/A';
            },
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
                            onClick={() => navigate(`/landlord/lease/${row._id}`)}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleTerminateLease(row._id)}
                            className="text-yellow-600 hover:text-yellow-800"
                        >
                            Terminate
                        </button>
                        <button
                            onClick={() => handleDeleteLease(row._id)}
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

    // useEffect(() => {
    //     if (isDeleteSuccess) {
    //         toast.success("Lease Delete successfully!");

    //     }
    // }, [isDeleteSuccess]);

    // useEffect(() => {
    //     if (isDeleteError) {
    //         toast.error("Failed to create lease.");
    //     }
    // }, [isDeleteError]);
    return (
        <div>
            <div className="sm:flex sm:items-center justify-center">
                <div className="sm:flex-auto">
                    <h2 className="text-lg font-bold text-gray-900">Lease Table</h2>
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
                        onClick={() => navigate('/landlord/lease')}
                    >
                        Add Lease
                    </button>
                </div>
            </div>

            <div className="mt-8 flow-root">
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        {LeaseData &&
                            <TableData
                                data={LeaseData?.result || []}
                                columns={columns}
                                enableSorting={true}
                                onPaginationChange={setPagination}
                                enableGlobalFilter={true}
                                onGlobalFilterChange={searchQuery}
                                initialPagination={pagination}
                                totalPages={LeaseData?.pagination?.totalPages}
                            />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaseTable;
