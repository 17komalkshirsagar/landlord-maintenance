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
import { useCreateMaintenanceRequestMutation, useGetMaintenanceRequestByIdQuery, useUpdateMaintenanceRequestMutation } from "../../redux/api/maintance.api";


// Schema
const maintenanceSchema = z.object({
    tenant: z.string().min(1, "Tenant is required"),
    property: z.string().min(1, "Property is required"),
    description: z.string().min(5, "Description must be more descriptive"),
    status: z.enum(["pending", "inProgress", "completed"]),
});

type MaintenanceFormData = z.infer<typeof maintenanceSchema>;

const Maintenance = () => {
    const form = useForm<MaintenanceFormData>({
        resolver: zodResolver(maintenanceSchema),
        defaultValues: {
            tenant: "",
            property: "",
            description: "",
            status: "pending",
        },
    });

    const { id } = useParams();
    const { data: tenants } = useGetAllTenantsQuery({ search: "", page: 1, limit: 10 });
    const { data: properties } = useGetAllPropertiesQuery({ search: "", page: 1, limit: 10 });
    const { data: maintenanceData, isLoading, isFetching } = useGetMaintenanceRequestByIdQuery(id || "", {
        skip: !id || !navigator.onLine,
    });

    const [createMaintenance, { isSuccess, isError }] = useCreateMaintenanceRequestMutation();
    const [updateMaintenance, { isSuccess: isUpdateSuccess, isError: isUpdateError }] = useUpdateMaintenanceRequestMutation();

    const { toast } = useToast();
    const navigate = useNavigate();

    const onSubmit = async (values: MaintenanceFormData) => {
        try {
            if (id) {
                await updateMaintenance({ id, maintenanceData: values }).unwrap();
            } else {
                await createMaintenance(values).unwrap();
            }
        } catch (err) {
            toast.error("Error saving maintenance");
        }
    };


    useEffect(() => {
        if (id && maintenanceData && !isFetching) {
            console.log("Fetched maintenanceData:", maintenanceData);
            form.reset({
                property: (maintenanceData?.property as any)?._id || maintenanceData?.property || '',
                tenant: (maintenanceData?.tenant as any)?._id || maintenanceData?.tenant || '',
                description: maintenanceData?.description || '',
                status: maintenanceData.status || 'pending',
            });
        }
    }, [id, maintenanceData, isFetching, form]);




    useEffect(() => {
        if (isSuccess) {
            toast.success("Lease created successfully!");
            navigate("/landlord/landlord/maintenance");
        }
    }, [isSuccess]);


    useEffect(() => {
        if (isError) {
            toast.error("Failed to create lease.");
        }
    }, [isError]);

    useEffect(() => {
        if (isUpdateSuccess) {
            toast.success("Lease updated successfully!");
            navigate("/landlord/maintenance/table");
        }
    }, [isUpdateSuccess]);


    useEffect(() => {
        if (isUpdateError) {
            toast.error("Failed to update lease.");
        }
    }, [isUpdateError]);
    return (
        <div className="max-w-4xl mx-auto mt-10 border p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-5 text-center">Maintenance Request</h2>
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

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
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
                                    {["pending", "inProgress", "completed"].map((status) => (
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
                            Submit Maintenance
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default Maintenance;
