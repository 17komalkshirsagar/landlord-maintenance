
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useToast } from '../../components/ui/use-toast';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "../../components/ui/form";
import { useGetAllTenantsQuery } from "../../redux/api/tenant.api";
import { useGetAllPropertiesQuery } from "../../redux/api/property.api";
import { useCreatePaymentMutation, useGetPaymentsByIdQuery } from "../../redux/api/payment.api";
import { useNavigate, useParams } from "react-router-dom";

const paymentSchema = z.object({
    tenant: z.string().min(1, "Tenant is required"),
    property: z.string().min(1, "Property is required"),
    amount: z.coerce.number().positive("Amount must be greater than zero"),
    paymentDate: z.string().min(1, "Payment Date is required"),
    paymentMethod: z.enum(["creditCard", "debitCard", "bankTransfer", "cash"]),
    status: z.enum(["pending", "completed", "failed"]),
    paymentType: z.enum(["rent", "tax", "utility"]),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

const Payment = () => {
    const form = useForm<PaymentFormData>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            tenant: "",
            property: "",
            amount: 0,
            paymentDate: "",
            paymentMethod: "cash",
            status: "pending",
            paymentType: "rent",
        },
    });
    const { id } = useParams()
    const { data: tenants } = useGetAllTenantsQuery({ search: "", page: 1, limit: 10 });
    const { data: properties } = useGetAllPropertiesQuery({ search: "", page: 1, limit: 10 });
    const [createPayment, { isSuccess, isError, }] = useCreatePaymentMutation()
    const { toast } = useToast();
    const navigate = useNavigate();
    const { data: pyamentData } = useGetPaymentsByIdQuery({ id: id || "" },
        { skip: !id || !navigator.onLine, });

    const onSubmit = (data: PaymentFormData) => {
        createPayment({ ...data, date: data.paymentDate })
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success("Create Propertu successfully!");
            navigate("/landlord/payment/table");
        }
    }, [isSuccess, navigate]);

    useEffect(() => {
        if (isError) {
            toast.error("Porter create failed. Please try again.");
        }
    }, [isError]);

    return (
        <div className="max-w-4xl mx-auto mt-10 border p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">{id ? "Update  Payment" : " Create Payment"}</h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="tenant"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tenant</FormLabel>
                                    <FormControl>
                                        <select {...field} className="w-full p-2 border rounded-md">
                                            <option value="">Select a Tenant</option>
                                            {tenants && tenants.result?.map((tenant: any) => (
                                                <option key={tenant._id} value={tenant._id}>
                                                    {tenant.name}
                                                </option>
                                            ))}
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="property"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Property</FormLabel>
                                    <FormControl>
                                        <select {...field} className="w-full p-2 border rounded-md">
                                            <option value="">Select a Property</option>
                                            {properties && properties?.result.map((property: any) => (
                                                <option key={property._id} value={property._id}>
                                                    {property.name}
                                                </option>
                                            ))}
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="paymentDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Payment Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Payment Type */}
                        <FormField
                            control={form.control}
                            name="paymentType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Payment Type</FormLabel>
                                    <FormControl>
                                        <select {...field} className="w-full p-2 border rounded-md">
                                            <option value="rent">Rent</option>
                                            <option value="tax">Tax</option>
                                            <option value="utility">Utility</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Payment Method */}
                        <FormField
                            control={form.control}
                            name="paymentMethod"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Payment Method</FormLabel>
                                    <div className="flex space-x-4">
                                        {["creditCard", "debitCard", "bankTransfer", "cash"].map((method) => (
                                            <label key={method} className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    value={method}
                                                    checked={field.value === method}
                                                    onChange={() => field.onChange(method)}
                                                />
                                                <span>{method}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>





                    {/* Status */}
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <div className="flex space-x-4">
                                    {["pending", "completed", "failed"].map((status) => (
                                        <label key={status} className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                value={status}
                                                checked={field.value === status}
                                                onChange={() => field.onChange(status)}
                                            />
                                            <span>{status}</span>
                                        </label>
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-center">
                        <Button type="submit" className="w-80">Submit Payment</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default Payment;
