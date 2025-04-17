import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from '../../components/ui/use-toast';
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "../../components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "../../components/ui/form";
import { toast } from "sonner";
import { useCreateBillMutation, useGetBillByIdQuery, useUpdateBillMutation } from "../../redux/api/bill.api";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAllPropertiesQuery } from "../../redux/api/property.api";


const formSchema = z.object({
    property: z.string().min(1, "Property is required"),
    billType: z.enum(["electricity", "water", "gas"]),
    amount: z.number().positive("Amount must be positive"),
    dueDate: z.string().min(1, "Due date is required"),
    paid: z.boolean().optional(),
});

const Bill = () => {
    const { id } = useParams()
    const navigate = useNavigate();
    const [createBill, { isSuccess, isError, }] = useCreateBillMutation();


    const { data: billData, isLoading, isFetching } = useGetBillByIdQuery(id || "", {
        skip: !id || !navigator.onLine,
    })
    const [updateBill, { isSuccess: updateSuccess }] = useUpdateBillMutation()
    const { data } = useGetAllPropertiesQuery({
        search: '',
        page: 1,
        limit: 10,
    });

    const { toast } = useToast()
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            property: "",
            billType: "electricity",
            amount: 0,
            dueDate: "",
            paid: false,
        },
    });


    const onSubmit = async (values: any) => {
        const formattedValues = {
            ...values,
            amount: values.amount.toString(),
            paid: values.paid?.toString(),
        };

        try {
            if (id) {
                await updateBill({ id, billData: formattedValues }).unwrap();
            } else {
                await createBill(formattedValues).unwrap();
            }

        } catch (err: any) {
            console.log("wrong");

        }
    };






    useEffect(() => {
        if (isSuccess) {
            toast.success("Create Bill successfully!");
            navigate("/landlord/bill/table");
        }
    }, [isSuccess, navigate]);

    useEffect(() => {
        if (updateSuccess) {
            toast.success("Update Success Bill successfully!");
            navigate("/landlord/bill/table");
        }
    }, [updateSuccess, navigate]);

    useEffect(() => {
        if (isError) {
            toast.error("Bill Create failed.");
        }
    }, [isError]);

    useEffect(() => {
        if (id && billData && !isLoading && !isFetching) {
            console.log("Resetting form with:", billData);
            form.reset({
                property: (billData?.property as any)?._id || billData?.property || '',
                billType: billData?.billType || '',
                amount: billData?.amount || 0,
                dueDate: billData.dueDate ? new Date(billData.dueDate).toISOString().split("T")[0] : '',

                paid: billData?.paid || false,
            });
        }
    }, [id, billData, isLoading, isFetching, form]);



    return (
        <div className="max-w-2xl mx-auto border p-6 rounded-xl shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center">{id ? "Update  Utility Bill" : " Utility Bill"}</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">


                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="property"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Property ID</FormLabel>
                                    <FormControl>
                                        <select
                                            {...field}
                                            className="w-full p-2 border rounded-md"
                                        >
                                            <option value="">Select a property</option>
                                            {data && data?.result.map((property: any) => (
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
                            name="billType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bill Type</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select bill type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="electricity">Electricity</SelectItem>
                                            <SelectItem value="water">Water</SelectItem>
                                            <SelectItem value="gas">Gas</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                                        <Input
                                            type="number"
                                            placeholder="Enter amount"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="dueDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Due Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>


                    <FormField
                        control={form.control}
                        name="paid"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel>Paid</FormLabel>
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full">
                        Submit
                    </Button>
                </form>
            </Form>

        </div>
    );
};

export default Bill;
