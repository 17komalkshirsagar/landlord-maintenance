import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Loader from '../../components/Loader';
import { useDeletePropertyMutation } from '../../redux/api/property.api';
import { useGetAllPropertiesQuery } from '../../redux/api/property.api';
import TableData from '../../components/TableData';
import { useDarkMode } from '@/context/ThemeContext';

const PropertyTable = () => {
    const { darkMode, toggleDarkMode } = useDarkMode();
    const [searchQuery, setSearchQuery] = useState<any>(null);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [deleteProperty] = useDeletePropertyMutation();
    const navigate = useNavigate();

    const { data: searchData, isLoading } = useGetAllPropertiesQuery({
        search: searchQuery?.trim() || '',
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
    });

    const handleDeleteProperty = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this Information?')) {
            try {
                await deleteProperty(id).unwrap();
            } catch (error) {
                console.error('Error deleting Information:', error);
            }
        }
    };

    const columns = [
        {
            accessorKey: 'name',
            cell: (info: any) => info.getValue(),
            header: 'Property Name',
        },
        {
            accessorKey: 'address',
            cell: (info: any) => info.getValue(),
            header: 'Address',
        },
        {
            accessorKey: 'city',
            cell: (info: any) => info.getValue(),
            header: 'City',
        },
        {
            header: 'Actions',
            cell: (info: any) => {
                const row = info.row.original;
                return (
                    <div>
                        <button
                            className={`text-indigo-600 hover:text-indigo-900 ${darkMode ? 'text-white' : 'text-black'}`}
                            onClick={() => navigate(`/landlord/property/${row._id}`)}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDeleteProperty(row._id)}
                            className={`text-red-600 hover:text-red-800 ms-7 ${darkMode ? 'text-white' : 'text-black'}`}
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
        <div className={`min-h-screen ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            <div>
                <div className="sm:flex sm:items-center justify-center">
                    <div className="sm:flex-auto">
                        <h2 className="text-lg font-bold">Property</h2>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 flex justify-between gap-5">
                        <input
                            type="text"
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="block w-72 h-10 rounded-md bg-white px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                        />
                        <button
                            type="button"
                            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                            onClick={() => navigate('/landlord/property')}
                        >
                            Add
                        </button>
                    </div>
                </div>

                <div className="mt-8 flow-root">
                    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            {searchData && (
                                <TableData
                                    data={searchData?.result || []}
                                    columns={columns}
                                    enableSorting={true}
                                    onPaginationChange={setPagination}
                                    enableGlobalFilter={true}
                                    onGlobalFilterChange={searchQuery}
                                    initialPagination={pagination}
                                    totalPages={searchData?.pagination?.totalPages}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyTable;
