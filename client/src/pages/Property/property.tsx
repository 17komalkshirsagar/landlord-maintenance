import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Toaster } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '../../components/ui/select';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '../../components/ui/form';
import {
    useCreatePropertyMutation,
    useGetPropertyByIdQuery,
    useUpdatePropertyMutation,
} from '../../redux/api/property.api';
import { useGetAllLandlordQuery } from '../../redux/api/Landlord.api';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../components/ui/use-toast';

const propertySchema = z.object({
    name: z.string().min(1, 'Property name is required'),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'Zip code is required'),
    rentAmount: z.number().min(1, 'Rent Amount is required'),
    type: z.enum(['residential', 'commercial']),
    status: z.enum(['available', 'rented']),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

const PropertyForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [createProperty, { isSuccess, isError }] = useCreatePropertyMutation();
    const [updateProperty, { isSuccess: isUpdateSuccess }] = useUpdatePropertyMutation();

    const { data: propertyData } = useGetPropertyByIdQuery(id || '', {
        skip: !id || !navigator.onLine,
    });

    const { data: landlordData } = useGetAllLandlordQuery(
        { search: id || '', page: 1, limit: 10 },
        { skip: !id || !navigator.onLine }
    );
    const maxProperties = 5;
    const [properties, setProperties] = useState([]);


    const form = useForm<PropertyFormValues>({
        resolver: zodResolver(propertySchema),
        defaultValues: {

            name: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            rentAmount: 0,
            type: 'residential',
            status: 'available',
        },
    });

    const { control, handleSubmit, reset, setValue, watch } = form;


    const onSubmit = (values: PropertyFormValues) => {
        console.log("Submitted form values:", values);
        if (id) {
            updateProperty({ id, updatedData: values });
        } else {
            createProperty(values);
            reset();
        }
    };

    useEffect(() => {
        if (id && propertyData) {
            reset({
                name: propertyData.name || '',
                address: propertyData.address || '',
                city: propertyData.city || '',
                state: propertyData.state || '',
                zipCode: propertyData.zipCode || '',
                rentAmount: Number(propertyData.rentAmount) || 0,
                type: propertyData.type,
                status: propertyData.status,
            });
        }
    }, [id, propertyData]);

    useEffect(() => {
        if (isError) {
            toast.error('You can only add 5 properties for free. Please upgrade to a premium subscription.');
            navigate('/landlord/rezor')
        }
    }, [isError])
    useEffect(() => {
        if (isSuccess) {
            toast.success('Rental agreement successfully');
            navigate('/landlord/property/table');
        }
    }, [isSuccess]);
    useEffect(() => {
        if (isUpdateSuccess) {
            toast.success('Update PRopety successfully')
        }
    }, [isUpdateSuccess]);
    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-6 text-center">
                {id ? 'Update Property' : 'Create Property'}
            </h2>





            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">



                    <div className="grid grid-cols-2 gap-4">

                        <FormField
                            control={control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Property Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter property name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Type */}
                        <FormField
                            control={control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="residential">Residential</SelectItem>
                                            <SelectItem value="commercial">Commercial</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter city" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={control}
                            name="state"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter state" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="zipCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Zip Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter zip code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={control}
                            name="rentAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rent Amount</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="available">Available</SelectItem>
                                            <SelectItem value="rented">Rented</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex justify-center mt-4">
                        <Button type="submit" className="w-80">
                            {id ? 'Update' : 'Submit'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default PropertyForm;

