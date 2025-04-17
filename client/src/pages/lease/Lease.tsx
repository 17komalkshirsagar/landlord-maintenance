import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useToast } from "../../components/ui/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAllTenantsQuery } from "../../redux/api/tenant.api";
import { useGetAllPropertiesQuery } from "../../redux/api/property.api";
import { useCreateLeaseMutation, useGetLeaseByIdQuery, useUpdateLeaseMutation } from "../../redux/api/leases.api";


const leaseSchema = z.object({
    tenant: z.string().min(1, "Tenant is required"),
    property: z.string().min(1, "Property is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    rentAmount: z.string().min(2, "Rent must be positive"),
    securityDeposit: z.string().min(2, "Security deposit is required"),
    terms: z.string().min(5, "Terms should be more descriptive"),
    status: z.enum(["active", "terminated"]),
});

type LeaseFormData = z.infer<typeof leaseSchema>;

const Lease = () => {
    const form = useForm<LeaseFormData>({
        resolver: zodResolver(leaseSchema),
        defaultValues: {
            tenant: "",
            property: "",
            startDate: "",
            endDate: "",
            rentAmount: "",
            securityDeposit: "",
            terms: "",
            status: "active",
        },
    });
    const { id } = useParams<{ id: string }>();
    const { data: tenants } = useGetAllTenantsQuery({ search: "", page: 1, limit: 10 });
    const { data: properties } = useGetAllPropertiesQuery({ search: "", page: 1, limit: 10 });
    const { data: leaseData } = useGetLeaseByIdQuery(id || "", { skip: !id });
    const [updateLease, { isSuccess: isUpdateSuccess, isError: isUpdateError }] = useUpdateLeaseMutation();
    const [createLease, { isSuccess, isError }] = useCreateLeaseMutation();
    const { toast } = useToast();

    const navigate = useNavigate();

    const onSubmit = async (values: LeaseFormData) => {
        try {
            if (id) {
                await updateLease({ id, leaseData: values }).unwrap();
            } else {
                await createLease(values).unwrap();
            }
        } catch (err: any) {
            console.log("error form froendt");

        }
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success("Lease created successfully!");
            navigate("/landlord/lease/table");
        }
    }, [isSuccess]);

    useEffect(() => {
        if (isError) {
            toast.error("Failed to create lease.");
        }
    }, [isError]);
    useEffect(() => {
        if (isUpdateSuccess) {
            toast.success("Lease Update successfully!");

        }
    }, [isUpdateSuccess]);

    useEffect(() => {
        if (isUpdateError) {
            toast.error("Failed to create lease.");
        }
    }, [isUpdateError]);


    useEffect(() => {
        if (id && leaseData) {
            form.reset({
                property: (leaseData.property as any)?._id || leaseData.property,
                tenant: leaseData.tenant || '',
                startDate: leaseData.startDate?.slice(0, 10) || '',
                endDate: leaseData.endDate?.slice(0, 10) || '',
                terms: leaseData.terms || '',
                rentAmount: leaseData.rentAmount ? String(leaseData.rentAmount) : '',
                securityDeposit: leaseData.securityDeposit ? String(leaseData.securityDeposit) : '',

                status: leaseData.status || 'active',
            });
        }
    }, [id, leaseData, form]);
    return (
        <div className="max-w-4xl mx-auto mt-10 border p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-5 text-center">Create Lease</h2>
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
                                            <option value="">Select Tenant</option>
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
                                            <option value="">Select Property</option>
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
                            name="startDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Start Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>End Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="rentAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rent Amount</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="securityDeposit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Security Deposit</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="terms"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Lease Terms</FormLabel>
                                <FormControl>
                                    <textarea {...field} className="w-full p-2 border rounded-md h-24" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <div className="flex space-x-4">
                                    {["active", "terminated"].map((status) => (
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
                        <Button type="submit" className="w-80">
                            Submit Lease
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default Lease;
