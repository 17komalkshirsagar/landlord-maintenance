import React, { useEffect, useState } from "react";
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

import { useGetAllPropertiesQuery } from "../../redux/api/property.api";
import {
    useCreateTenantMutation,
    useGetTenantByIdQuery,
    useUpdateTenantMutation,
} from "../../redux/api/tenant.api";

import { useParams, useNavigate } from "react-router-dom";

// Zod validation schema
const tenantSchema = z.object({
    name: z.string().min(1, "Name is required"),
    mobile: z.string().min(10, "Mobile number is required"),
    leaseStart: z.string().min(1, "Lease start date is required"),
    leaseEnd: z.string().min(1, "Lease end date is required"),
    rentAmount: z.string().min(1, "Rent amount is required"),
    securityDeposit: z.string().min(1, "Security deposit is required"),
    property: z.string().min(1, "Property is required"),
    status: z.enum(["pending", "approved", "rejected"]),
});

type TenantFormData = z.infer<typeof tenantSchema>;

const Tenant = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const form = useForm<TenantFormData>({
        resolver: zodResolver(tenantSchema),
        defaultValues: {
            name: "",
            mobile: "",
            leaseStart: "",
            leaseEnd: "",
            rentAmount: "",
            securityDeposit: "",
            property: "",
            status: "pending",
        },
    });

    const { toast } = useToast();
    const { data: properties } = useGetAllPropertiesQuery({ search: "", page: 1, limit: 10 });
    const [createTenant, { isSuccess, isError }] = useCreateTenantMutation();
    const [updateTenant, { isSuccess: isUpdateSuccess, isError: isUpdateError }] = useUpdateTenantMutation();

    const { data: tenant } = useGetTenantByIdQuery(id || "", { skip: !id });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [docFiles, setDocFiles] = useState<File[]>([]);

    const { control, handleSubmit, reset, setValue } = form;

    const onSubmit = async (values: TenantFormData) => {
        const formData = new FormData();
        for (const [key, value] of Object.entries(values)) {
            formData.append(key, value);
        }

        if (imageFile) {
            formData.append("image", imageFile);
        }

        docFiles.forEach(file => {
            formData.append("documents", file);
        });

        try {
            if (id) {
                await updateTenant({ id, updatedData: formData }).unwrap();
            } else {
                await createTenant(formData).unwrap();
            }

            reset();
            setImageFile(null);
            setDocFiles([]);
        } catch (error) {
            console.error("Tenant error:", error);
        }
    };

    useEffect(() => {
        if (id && tenant) {
            reset({
                name: tenant.name || "",
                mobile: tenant.mobile || "",
                leaseStart: tenant.leaseStart ? new Date(tenant.leaseStart).toISOString().slice(0, 10) : "",
                leaseEnd: tenant.leaseEnd ? new Date(tenant.leaseEnd).toISOString().slice(0, 10) : "",
                rentAmount: tenant.rentAmount?.toString() || "",
                securityDeposit: tenant.securityDeposit?.toString() || "",
                property: tenant.property || "",
                status: tenant.status || "pending",
            });
        }
    }, [id, tenant, reset]);

    useEffect(() => {
        if (isSuccess) {
            toast.success("Lease created successfully!");
            navigate("/landlord/tenant/table");
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
            navigate("/tenant");
        }
    }, [isUpdateSuccess]);

    useEffect(() => {
        if (isUpdateError) {
            toast.error("Failed to create lease.");
        }
    }, [isUpdateError]);


    return (
        <div className="max-w-4xl mx-auto mt-10 border p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">
                {id ? "Update Tenant" : "Add Tenant"}
            </h2>

            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <div className="grid grid-cols-2 gap-4">
                        <FormField name="name" control={control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField name="mobile" control={control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mobile</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>


                    <div className="grid grid-cols-2 gap-4">
                        <FormField name="leaseStart" control={control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Lease Start</FormLabel>
                                <FormControl><Input type="date" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="leaseEnd" control={control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Lease End</FormLabel>
                                <FormControl><Input type="date" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>

                    {/* Rent & Security */}
                    <div className="grid grid-cols-2 gap-4">
                        <FormField name="rentAmount" control={control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Rent Amount</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField name="securityDeposit" control={control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Security Deposit</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>

                    {/* Property Select & Image */}
                    <div className="grid grid-cols-2 gap-4">
                        <FormField name="property" control={control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Property</FormLabel>
                                <FormControl>
                                    <select {...field} className="w-full p-2 border rounded-md">
                                        <option value="">Select Property</option>
                                        {properties?.result.map((prop: any) => (
                                            <option key={prop._id} value={prop._id}>
                                                {prop.name}
                                            </option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormItem>
                            <FormLabel>Image Upload</FormLabel>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) setImageFile(file);
                                }}
                            />
                            <FormMessage />
                        </FormItem>
                    </div>

                    {/* Documents & Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <FormItem>
                            <FormLabel>Upload PDF Documents (Max 5)</FormLabel>
                            <Input
                                type="file"
                                accept="application/pdf"
                                multiple
                                onChange={(e) => {
                                    const files = e.target.files;
                                    if (files) setDocFiles(Array.from(files).slice(0, 5));
                                }}
                            />
                            <FormMessage />
                        </FormItem>

                        <FormField name="status" control={control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <div className="flex gap-4 mt-1">
                                    {["pending", "approved", "rejected"].map((status) => (
                                        <label key={status} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                value={status}
                                                checked={field.value === status}
                                                onChange={() => field.onChange(status)}
                                            />
                                            <span className="capitalize">{status}</span>
                                        </label>
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>

                    {/* Submit */}
                    <div className="flex justify-center mt-6">
                        <Button type="submit" className="w-80">
                            {id ? "Update Tenant" : "Submit Tenant"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default Tenant;
