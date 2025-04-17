import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from '../../components/ui/use-toast';
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { RadioGroup } from "../../components/ui/radio-group";
//Baki ahe 
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "../../components/ui/form";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAllPropertiesQuery } from "../../redux/api/property.api";
import { useCreateContractMutation, useGetContractByIdQuery, useUpdateContractMutation } from "../../redux/api/contracts.api";
import { useGetAllTenantsQuery } from "../../redux/api/tenant.api";

const contractSchema = z.object({
    property: z.string().min(1, "Property is required"),
    tenant: z.string().min(1, "Tenant is required"),
    startDate: z.string().min(1, "Start Date is required"),
    expiryDate: z.string().min(1, "Expiry Date is required"),
    status: z.enum(["pending", "approved", "rejected"]),
});

type ContractFormData = z.infer<typeof contractSchema>;

const Contract = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [createContract, { isSuccess, isError }] = useCreateContractMutation();
    const { data: contractData } = useGetContractByIdQuery(id || "", { skip: !id });
    const [updateContract] = useUpdateContractMutation();
    const { data: properties } = useGetAllPropertiesQuery({ search: "", page: 1, limit: 10 });
    const { data } = useGetAllTenantsQuery({
        search: '', page: 1, limit: 10,
    });

    console.log("Properties =>", properties?.result);

    const { toast } = useToast();
    const form = useForm<ContractFormData>({
        resolver: zodResolver(contractSchema),
        defaultValues: {
            property: "",
            tenant: "",
            startDate: "",
            expiryDate: "",
            status: "pending",
        },
    });

    const onSubmit = async (values: ContractFormData) => {
        try {
            if (id) {
                await updateContract({ id, contractData: values }).unwrap();
            } else {
                await createContract(values).unwrap();
            }
        } catch (err: any) {
            toast.error("An error occurred while processing the contract.");
        }
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success("Contract created/updated successfully!");
            navigate("/landlord/contract/table");
        }
    }, [isSuccess, navigate]);

    useEffect(() => {
        if (isError) {
            toast.error("Contract creation/update failed.");
        }
    }, [isError]);

    useEffect(() => {
        if (id && contractData) {
            form.reset({
                property: (contractData.property as any)?._id || contractData.property,
                tenant: (contractData.tenant as any)?._id || contractData.tenant,
                startDate: contractData.startDate?.slice(0, 10) || '',
                expiryDate: contractData.expiryDate?.slice(0, 10) || '',
                status: contractData.status || 'pending',
            });
        }
    }, [id, contractData, form]);


    return (
        <div className="max-w-3xl mx-auto border p-6 rounded-xl shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center">{id ? "Update  Contract" : " Create Contract"}</h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Property and Tenant side by side */}
                        <FormField
                            control={form.control}
                            name="property"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Property</FormLabel>
                                    <FormControl>
                                        <select {...field} className="w-full p-2 border rounded-md">
                                            <option value="">Select a Property</option>
                                            {properties && properties?.result.map((property) => (
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
                        <FormField
                            control={form.control}
                            name="tenant"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tenant</FormLabel>
                                    <FormControl>
                                        <select {...field} className="w-full p-2 border rounded-md">
                                            <option value="">Select a Tenant</option>
                                            {data && data.result?.map((tenant: any) => (
                                                <option key={tenant._id} value={tenant._id}>
                                                    {tenant.name || tenant.name || "Unnamed Tenant"}
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
                        {/* Start Date and Expiry Date side by side */}
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
                            name="expiryDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Expiry Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* <div className="grid grid-cols-1 gap-4">
                        
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <select {...field} className="w-full p-2 border rounded-md">
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* </div> */}

                    <div className="grid grid-cols-1 gap-4">
                        <FormField
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <div className="flex space-x-4">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                id="pending"
                                                value="pending"
                                                checked={field.value === "pending"}
                                                onChange={() => field.onChange("pending")}  // Pass the value directly
                                            />
                                            <span>Pending</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                id="approved"
                                                value="approved"
                                                checked={field.value === "approved"}
                                                onChange={() => field.onChange("approved")}  // Pass the value directly
                                            />
                                            <span>Approved</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                id="rejected"
                                                value="rejected"
                                                checked={field.value === "rejected"}
                                                onChange={() => field.onChange("rejected")}  // Pass the value directly
                                            />
                                            <span>Rejected</span>
                                        </label>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>




                    <div className="flex justify-center">
                        <Button type="submit" className="w-80">
                            Submit
                        </Button>
                    </div>

                </form>
            </Form>
        </div>
    );
};

export default Contract;
