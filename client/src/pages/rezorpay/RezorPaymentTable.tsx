import React, { useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { useDeleteRezorPaymentMutation, useGetAllPropertiesPaymentQuery } from '../../redux/api/rezorpay.api';
import { useBlockLandlordMutation } from '../../redux/api/Landlord.api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const RezorPaymentTable = () => {
    const { data } = useGetAllPropertiesPaymentQuery();
    const [blockLandlord, { isLoading, isSuccess }] = useBlockLandlordMutation();
    const [deleteRezorePayment] = useDeleteRezorPaymentMutation()
    const navigate = useNavigate();
    const handleBlock = (id: string) => {
        blockLandlord(id).unwrap()
    };


    useEffect(() => {
        if (isSuccess) {
            toast.success('Lanlord Block successfully');
            // navigate("/landlord/rental/table");
        }
    }, [isSuccess]);
    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">All Admin Rezor Pay Payments</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Landlord Email</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Receipt</TableHead>
                        <TableHead>Mobile</TableHead>
                        <TableHead>Date&Time</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((payment: any) => (
                        <TableRow key={payment._id}>
                            <TableCell>{payment.name}</TableCell>
                            <TableCell>{payment.landlord?.email || "N/A"}</TableCell>
                            <TableCell>₹{payment.price}</TableCell>
                            <TableCell>{payment.status}</TableCell>
                            <TableCell>{payment.orderId}</TableCell>
                            <TableCell>{payment.receipt}</TableCell>
                            <TableCell>{payment.landlord?.mobile}</TableCell>
                            <TableCell>{new Date(payment.createdAt || "N/A").toLocaleString()}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button
                                        variant="secondary"
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white"
                                        onClick={() => handleBlock(payment.landlord?._id)}
                                        disabled={isLoading}
                                    >
                                        Block
                                    </Button>

                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            deleteRezorePayment(payment._id).unwrap();
                                        }}
                                        disabled={isLoading}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default RezorPaymentTable;
