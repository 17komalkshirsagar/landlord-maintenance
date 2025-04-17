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
import {
    useCreateTenantHistoryMutation,
    useGetTenantHistoryByIdQuery,
    useUpdateTenantMutation,
} from "../../redux/api/tenantHistory.api";


const tenantHistorySchema = z.object({
    tenant: z.string().min(1, "Tenant is required"),
    property: z.string().min(1, "Property is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
});

type TenantHistoryFormData = z.infer<typeof tenantHistorySchema>;

const TenantHistory = () => {
    const form = useForm<TenantHistoryFormData>({
        resolver: zodResolver(tenantHistorySchema),
        defaultValues: {
            tenant: "",
            property: "",
            startDate: "",
            endDate: "",
        },
    });

    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const { data: tenants } = useGetAllTenantsQuery({ search: "", page: 1, limit: 10 });
    const { data: properties } = useGetAllPropertiesQuery({ search: "", page: 1, limit: 10 });
    console.log("properties:", properties);

    const { data: tenantHistoryData } = useGetTenantHistoryByIdQuery(id || "", { skip: !id });
    console.log(tenantHistoryData)

    const [createTenantHistory, { isSuccess }] = useCreateTenantHistoryMutation();
    const [updateTenantHistory, { isSuccess: isUpdateSuccess }] = useUpdateTenantMutation();

    const onSubmit = async (values: TenantHistoryFormData) => {
        try {
            if (id) {
                await updateTenantHistory({ id, historyData: values, }).unwrap();

            } else {
                await createTenantHistory(values).unwrap();
            }
        } catch (error) {
            console.log("error");

        }
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success("Tenant create history created!");
            navigate("/landlord/tenanthistory/table");
        }
    }, [isSuccess]);
    useEffect(() => {
        if (isUpdateSuccess) {
            toast.success("Tenant Update history created!");
            navigate("/landlord/tenanthistory/table");
        }
    }, [isUpdateSuccess]);

    useEffect(() => {
        if (id && tenantHistoryData) {
            form.reset({
                property: (tenantHistoryData.property as any)?._id || tenantHistoryData.property,
                tenant: tenantHistoryData.tenant || '',
                startDate: tenantHistoryData.startDate?.split("T")[0],
                endDate: tenantHistoryData.endDate?.split("T")[0] || "",
            });
        }
    }, [id, tenantHistoryData, form]);

    return (
        <div className="max-w-4xl mx-auto mt-10 border p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-5 text-center">
                {id ? "Edit Tenant History" : "Create Tenant History"}
            </h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Tenant */}
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

                        {/* Property */}
                        <FormField
                            control={form.control}
                            name="property"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Property</FormLabel>
                                    <FormControl>
                                        <select {...field} className="w-full p-2 border rounded-md">
                                            <option value="">Select Property</option>
                                            {Array.isArray(properties?.result) &&
                                                properties.result.map((property: any) => (
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
                        {/* Start Date */}
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

                        {/* End Date */}
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



                    {/* Submit Button */}
                    <div className="flex justify-center mb-10">
                        <Button type="submit" className="w-80">
                            {id ? "Update" : "Submit"} Tenant History
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default TenantHistory;
