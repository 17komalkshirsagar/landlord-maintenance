import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '../../components/ui/use-toast';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../../components/ui/form';
import { useCreateTaxMutation, useUpdateTaxMutation, useGetTaxesIdQuery } from '../../redux/api/tax.api';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetAllPropertiesQuery } from '../../redux/api/property.api';

const formSchema = z.object({
    property: z.string().min(1, "Property is required"),
    taxType: z.enum(["property tax", "building tax", "holding tax", "tower tax"]),
    taxAmount: z.number().positive("Tax amount must be positive"),
    dueDate: z.string().min(1, "Due date is required"),
    paid: z.boolean().optional(),
});

const Tax = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: properties } = useGetAllPropertiesQuery({ search: "", page: 1, limit: 10 });

    const { data: taxData } = useGetTaxesIdQuery(id || '', {
        skip: !id || !navigator.onLine,
    });
    const [createTax, { isSuccess }] = useCreateTaxMutation();
    const [updateTax, { isSuccess: isUpdateSuccess }] = useUpdateTaxMutation();
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            property: '',
            taxType: 'property tax',
            taxAmount: 0,
            dueDate: '',
            paid: false,
        },
    });

    const onSubmit = async (values: any) => {
        const formattedValues = {
            ...values,
            taxAmount: values.taxAmount.toString(),
            paid: values.paid?.toString(),
        };

        console.log("Submitting values:", formattedValues)
        try {
            if (id) {
                console.log("Updating tax with data: ", formattedValues);
                await updateTax({ id, data: formattedValues }).unwrap();
            } else {
                await createTax(formattedValues).unwrap();
            }
        } catch (err: any) {
            console.log("Error submitting tax form:", err);
        }
    };

    useEffect(() => {
        if (id && taxData) {
            console.log("Fetched taxData:", taxData);
            form.reset({
                property: (taxData?.property as any)?._id || taxData?.property || '',


                taxType: taxData.taxType || 'property tax',
                taxAmount: taxData.taxAmount || 0,
                dueDate: taxData.dueDate ? new Date(taxData.dueDate).toISOString().split("T")[0] : '',
                paid: taxData.paid || false,
            });
        }
    }, [id, taxData, form]);


    useEffect(() => {
        if (isSuccess) {
            toast.success('Teantn successfully');
            navigate("/landlord/tax/table");
        }
    }, [isSuccess]);

    useEffect(() => {
        if (isUpdateSuccess) {
            toast.success('update Sucessfule successfully');
            navigate("/landlord/tax/table");
        }
    }, [isUpdateSuccess]);

    return (
        <div className="max-w-2xl mx-auto border p-6 rounded-xl shadow-md mt-10">
            <h2 className="text-xl font-bold mb-4 ">{id ? "Update Tax Record" : "Create Tax Record"}</h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
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

                        <FormField
                            control={form.control}
                            name="taxType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tax Type</FormLabel>
                                    <Select {...field} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="property tax">Property Tax</SelectItem>
                                            <SelectItem value="building tax">Building Tax</SelectItem>
                                            <SelectItem value="holding tax">Holding Tax</SelectItem>
                                            <SelectItem value="tower tax">Tower Tax</SelectItem>
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
                            name="taxAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tax Amount</FormLabel>
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

                    <Button type="submit" className="w-full">Submit</Button>
                </form>
            </Form>
        </div>
    );
};

export default Tax;
