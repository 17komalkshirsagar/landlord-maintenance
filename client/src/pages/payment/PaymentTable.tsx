


import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Loader from '../../components/Loader';
import TableData from '../../components/TableData';

import { useDeletePaymentMutation, useGetAllPaymentsQuery } from '../../redux/api/payment.api';

const PaymentTable = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    const navigate = useNavigate();
    const [deleteContract] = useDeletePaymentMutation();

    const { data: pyamentData, isLoading } = useGetAllPaymentsQuery({
        search: searchQuery.trim(),
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        isFetchAll: false

    });
    console.log("pyamentData:", pyamentData);
    const handleDeletePayment = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this Contract?')) {
            try {
                await deleteContract({ id }).unwrap();
                alert('Contract deleted successfully!');
            } catch (err) {
                console.error('Delete failed:', err);
                alert('Failed to delete contract.');
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
            accessorKey: 'paymentType',
            header: 'Payment Type',
            cell: (info: any) => info.getValue(),
        },
        {
            accessorKey: 'paymentMethod',
            header: 'Payment Method',
            cell: (info: any) => info.getValue(),
        },
        {
            accessorKey: 'property.name',
            header: 'Property Name',
            cell: (info: any) => info.row.original?.property?.name || 'N/A',


        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: (info: any) => `₹${info.getValue()}`,
        },
        {
            accessorKey: 'tenant.status',
            header: 'Status',
            cell: (info: any) => info.row.original?.tenant?.status || 'N/A',
        },
        {
            accessorKey: "paymentDate",
            header: 'Start Date',
            cell: (info: any) => {
                const dueDate = info.getValue();
                return dueDate ? new Date(dueDate).toLocaleDateString() : 'N/A';
            },
        },


        {
            header: 'Actions',
            cell: (info: any) => {
                const row = info.row.original;
                return (
                    <div className="flex gap-4">
                        <button
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={() => navigate(`/payment/${row._id}`)}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDeletePayment(row._id)}
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
                    <h2 className="text-lg font-bold text-gray-900">Contract Table</h2>
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
                        onClick={() => navigate('/payment')}
                    >
                        Add Contract
                    </button>
                </div>
            </div>

            <div className="mt-8 flow-root">
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        {pyamentData &&
                            <TableData
                                data={pyamentData?.result || []}
                                columns={columns}
                                enableSorting={true}
                                onPaginationChange={setPagination}
                                enableGlobalFilter={true}
                                onGlobalFilterChange={searchQuery}
                                initialPagination={pagination}
                                totalPages={pyamentData?.pagination?.totalPages}
                            />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentTable;
