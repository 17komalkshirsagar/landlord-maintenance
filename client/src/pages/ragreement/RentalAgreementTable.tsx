import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Loader from '../../components/Loader';
import TableData from '../../components/TableData';
import { useDeleteRentalAgreementMutation, useGetAllRentalAgreementsQuery } from '../../redux/api/createRentalAgreement.api';

const RentalAgreementTable = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const navigate = useNavigate();

    const { data: rentalAgreements, isLoading } = useGetAllRentalAgreementsQuery({
        search: searchQuery?.trim(),
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,

    });
    console.log("rentalAgreements:", rentalAgreements);

    const [deleteRentalAgreement] = useDeleteRentalAgreementMutation();

    const handleDeleteAgreement = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this agreement?")) {
            try {
                await deleteRentalAgreement(id).unwrap();
            } catch (error) {
                console.error("Failed to delete:", error);
            }
        }
    };

    const columns = [
        {
            header: 'Landlord',
            accessorKey: 'landlord.name',
            cell: ({ row }: any) => row.original.landlord?.name,
        },
        {
            header: 'Tenant',
            accessorKey: 'tenant.name',
            cell: ({ row }: any) => row.original.tenant?.name,
        },
        {
            header: 'Property',
            accessorKey: 'property.name',
            cell: ({ row }: any) => row.original.property?.name,
        },
        {
            accessorKey: 'startDate',
            header: 'Start Date',
            cell: (info: any) => new Date(info.getValue()).toLocaleDateString(),
        },
        {
            accessorKey: 'endDate',
            header: 'End Date',
            cell: (info: any) => new Date(info.getValue()).toLocaleDateString(),
        },
        {
            accessorKey: 'monthlyRent',
            header: 'Rent',
            cell: (info: any) => `₹${info.getValue()}`,
        },
        {
            accessorKey: 'status',
            header: 'Status',
        },
        {
            header: 'Actions',
            cell: (info: any) => {
                const row = info.row.original;
                return (
                    <div className="space-x-2">
                        <button
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={() => navigate(`/landlord/rental/${row._id}`)}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDeleteAgreement(row._id)}
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
                <h2 className="text-lg font-bold text-gray-900">Rental Agreements</h2>
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
                        onClick={() => navigate('/landlord/rental')}
                    >
                        Add
                    </button>
                </div>
            </div>

            <div className="mt-8">
                <TableData
                    data={rentalAgreements?.result || []}
                    columns={columns}
                    enableSorting={true}
                    onPaginationChange={setPagination}
                    enableGlobalFilter={true}
                    onGlobalFilterChange={searchQuery}
                    initialPagination={pagination}
                    totalPages={rentalAgreements?.pagination?.totalPages}
                />
            </div>
        </div>
    );
};

export default RentalAgreementTable;



