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
import { useCreateRentalAgreementMutation, useGetRentalAgreementByTenantQuery, useUpdateRentalAgreementMutation, } from "../../redux/api/createRentalAgreement.api";
import { useGetAllLandlordQuery } from "../../redux/api/Landlord.api";


const agreementSchema = z.object({
    tenant: z.string().min(1, "Tenant is required"),
    property: z.string().min(1, "Property is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    monthlyRent: z.string().min(1, "Monthly rent is required"),
    contractRenewalDate: z.string().min(1, "Contract renewal date is required"),
    status: z.enum(["active", "expired"]),
});

type AgreementFormData = z.infer<typeof agreementSchema>;

const RentalAgreement = () => {
    const form = useForm<AgreementFormData>({
        resolver: zodResolver(agreementSchema),
        defaultValues: {
            tenant: "",
            property: "",
            startDate: "",
            endDate: "",
            monthlyRent: "",
            contractRenewalDate: "",
            status: "active",
        },
    });

    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const { data: tenants } = useGetAllTenantsQuery({ search: "", page: 1, limit: 10 });
    const { data: properties } = useGetAllPropertiesQuery({ search: "", page: 1, limit: 10 });
    const { data: rentalAgreement } = useGetRentalAgreementByTenantQuery(id || "", { skip: !id });

    const [updateAgreement, { isSuccess: isUpdateSuccess }] = useUpdateRentalAgreementMutation();
    const [createAgreement, { isSuccess }] = useCreateRentalAgreementMutation();

    const onSubmit = async (values: AgreementFormData) => {
        const payload = {
            ...values,
            monthlyRent: Number(values.monthlyRent),
        };
        try {
            if (id) {

                await updateAgreement({ id, ...payload }).unwrap();
            } else {

                await createAgreement(payload).unwrap();
            }
        } catch (error) {
            console.log("erro form on Submit");

        }
    };




    useEffect(() => {
        if (id && rentalAgreement) {
            console.log("Loaded agreement", rentalAgreement);
            form.reset({
                tenant: rentalAgreement.tenant || "",
                property: rentalAgreement.property || "",

                endDate: rentalAgreement.endDate ? new Date(rentalAgreement.endDate).toISOString().split("T")[0] : '',
                startDate: rentalAgreement.startDate ? new Date(rentalAgreement.startDate).toISOString().split("T")[0] : '',

                monthlyRent: rentalAgreement.monthlyRent.toString(),
                contractRenewalDate: rentalAgreement.contractRenewalDate?.slice(0, 10),
                status: rentalAgreement.status,
            });
        }
    }, [id, rentalAgreement, form]);


    useEffect(() => {
        if (isSuccess) {
            toast.success('Rental agreement successfully');
            navigate("/landlord/rental/table");
        }
    }, [isSuccess]);
    useEffect(() => {
        if (isUpdateSuccess) {
            toast.success('Update agreement successfully')
        }
    }, [isUpdateSuccess]);

    return (
        <div className="max-w-4xl mx-auto mt-10 border p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-5 text-center">
                {id ? "Update" : "Create"} Rental Agreement
            </h2>
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
                                            {tenants?.result?.map((tenant: any) => (
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
                    </div>



                    <div className="grid grid-cols-2 gap-4">
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
                        <FormField
                            control={form.control}
                            name="monthlyRent"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Monthly Rent</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
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
                            name="contractRenewalDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contract Renewal Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
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
                                    <div className="flex gap-4">
                                        {["active", "expired"].map((status) => (
                                            <label key={status} className="flex items-center gap-2">
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


                    </div>


                    <div className="flex justify-center">
                        <Button type="submit" className="w-80">
                            {id ? "Update" : "Create"} Agreement
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default RentalAgreement;






// import React, { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//     Form,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormControl,
//     FormMessage,
// } from "../../components/ui/form";
// import { Input } from "../../components/ui/input";
// import { Button } from "../../components/ui/button";
// import { useToast } from "../../components/ui/use-toast";
// import { useNavigate, useParams } from "react-router-dom";

// import { useGetAllTenantsQuery } from "../../redux/api/tenant.api";
// import { useGetAllPropertiesQuery } from "../../redux/api/property.api";
// import {
//     useCreateRentalAgreementMutation,
//     useGetRentalAgreementByTenantQuery,
//     useUpdateRentalAgreementMutation,
// } from "../../redux/api/createRentalAgreement.api";

// const agreementSchema = z.object({
//     tenant: z.string().min(1, "Tenant is required"),
//     property: z.string().min(1, "Property is required"),
//     startDate: z.string().min(1, "Start date is required"),
//     endDate: z.string().min(1, "End date is required"),
//     monthlyRent: z.string().min(1, "Monthly rent is required"),
//     contractRenewalDate: z.string().min(1, "Contract renewal date is required"),
//     status: z.enum(["active", "expired"]),
// });

// type AgreementFormData = z.infer<typeof agreementSchema>;

// const RentalAgreement = () => {
//     const form = useForm<AgreementFormData>({
//         resolver: zodResolver(agreementSchema),
//         defaultValues: {
//             tenant: "",
//             property: "",
//             startDate: "",
//             endDate: "",
//             monthlyRent: "",
//             contractRenewalDate: "",
//             status: "active",
//         },
//     });

//     const { id } = useParams();
//     const navigate = useNavigate();
//     const { toast } = useToast();

//     const { data: tenants } = useGetAllTenantsQuery({ search: "", page: 1, limit: 10 });
//     const { data: properties } = useGetAllPropertiesQuery({ search: "", page: 1, limit: 10 });
//     const { data: rentalAgreement } = useGetRentalAgreementByTenantQuery(id || "", { skip: !id });
//     console.log("tenants:", tenants);

//     const [updateAgreement, { isSuccess: isUpdateSuccess }] = useUpdateRentalAgreementMutation();
//     const [createAgreement, { isSuccess }] = useCreateRentalAgreementMutation();

//     const { control, handleSubmit, reset } = form;

//     const onSubmit = async (values: AgreementFormData) => {
//         const payload = {
//             ...values,
//             monthlyRent: Number(values.monthlyRent),
//         };
//         try {
//             if (id) {
//                 await updateAgreement({ id, ...payload }).unwrap();
//             } else {
//                 await createAgreement(payload).unwrap();
//             }
//         } catch (error) {
//             console.log("Error submitting form", error);
//         }
//     };

//     useEffect(() => {
//         if (id && rentalAgreement) {
//             reset({
//                 tenant: rentalAgreement.tenant || "",
//                 property: rentalAgreement.property || "",
//                 startDate: rentalAgreement.startDate?.slice(0, 10) || "",
//                 endDate: rentalAgreement.endDate?.slice(0, 10) || "",
//                 monthlyRent: rentalAgreement.monthlyRent?.toString() || "",
//                 contractRenewalDate: rentalAgreement.contractRenewalDate?.slice(0, 10) || "",
//                 status: rentalAgreement.status,
//             });
//         }
//     }, [id, rentalAgreement, reset]);

//     useEffect(() => {
//         if (isSuccess) {
//             toast.success("Rental agreement created successfully");
//             navigate("/rental/table");
//         }
//     }, [isSuccess]);

//     useEffect(() => {
//         if (isUpdateSuccess) {
//             toast.success("Rental agreement updated successfully");
//             navigate("/rental/table");
//         }
//     }, [isUpdateSuccess]);

//     return (
//         <div className="max-w-4xl mx-auto mt-10 border p-6 rounded-xl shadow-md">
//             <h2 className="text-xl font-bold mb-5 text-center">
//                 {id ? "Update" : "Create"} Rental Agreement
//             </h2>
//             <Form {...form}>
//                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                     <div className="grid grid-cols-2 gap-4">
//                         <FormField
//                             control={control}
//                             name="tenant"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Tenant</FormLabel>
//                                     <FormControl>
//                                         <select {...field} className="w-full p-2 border rounded-md">
//                                             <option value="">Select Tenant</option>
//                                             {tenants && tenants?.result.map((tenant: any) => (
//                                                 <option key={tenant._id} value={tenant._id}>
//                                                     {tenant.name}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         <FormField
//                             control={control}
//                             name="property"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Property</FormLabel>
//                                     <FormControl>
//                                         <select {...field} className="w-full p-2 border rounded-md">
//                                             <option value="">Select Property</option>
//                                             {properties?.result.map((property: any) => (
//                                                 <option key={property._id} value={property._id}>
//                                                     {property.name}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                         <FormField
//                             control={control}
//                             name="monthlyRent"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Monthly Rent</FormLabel>
//                                     <FormControl>
//                                         <Input type="number" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         <FormField
//                             control={control}
//                             name="contractRenewalDate"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Contract Renewal Date</FormLabel>
//                                     <FormControl>
//                                         <Input type="date" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                         <FormField
//                             control={control}
//                             name="startDate"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Start Date</FormLabel>
//                                     <FormControl>
//                                         <Input type="date" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         <FormField
//                             control={control}
//                             name="endDate"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>End Date</FormLabel>
//                                     <FormControl>
//                                         <Input type="date" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                     </div>

//                     <FormField
//                         control={control}
//                         name="status"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Status</FormLabel>
//                                 <div className="flex gap-4">
//                                     {["active", "expired"].map((status) => (
//                                         <label key={status} className="flex items-center gap-2">
//                                             <input
//                                                 type="radio"
//                                                 value={status}
//                                                 checked={field.value === status}
//                                                 onChange={() => field.onChange(status)}
//                                             />
//                                             <span>{status}</span>
//                                         </label>
//                                     ))}
//                                 </div>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />

//                     <div className="flex justify-center">
//                         <Button type="submit" className="w-80">
//                             {id ? "Update" : "Create"} Agreement
//                         </Button>
//                     </div>
//                 </form>
//             </Form>
//         </div>
//     );
// };

// export default RentalAgreement;
