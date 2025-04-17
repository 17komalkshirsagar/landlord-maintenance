import { createApi } from "@reduxjs/toolkit/query/react";
import { createCustomBaseQuery } from "./customBaseQuery.api";

const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/v1/user`
const customBaseQuery = createCustomBaseQuery(baseUrl);


export interface IRentalAgreement {
    tenant: string;
    property: string;
    terms: string;
}

export interface ILease {
    tenant: string;
    property: string;
    startDate: string;
    endDate: string;
    rentAmount: number;
}

export interface IProperty {
    _id: string;
    name: string;
    location: string;
    status: "available" | "rented";
    price: number;
}

export interface IMaintenanceRequest {
    tenant: string;
    issue: string;
    status: "pending" | "resolved";
}

export interface INotification {
    recipient: string;
    message: string;
    createdAt: string;
}

export const rentalServiceApi = createApi({
    reducerPath: "rentalServiceApi",
    baseQuery: customBaseQuery,
    tagTypes: ["rental", "property", "lease", "notification"],

    endpoints: (builder) => ({
        signRentalAgreement: builder.mutation<string, IRentalAgreement>({
            query: (data) => ({
                url: "/sign",
                method: "POST",
                body: data,
            }),
            transformResponse: (data: { result: string }) => data.result,
            transformErrorResponse: (error: { status: number, data: { message: string } }) => error.data?.message,
            invalidatesTags: ["rental"],
        }),

        // Get lease details for a tenant
        getLeaseDetails: builder.query<ILease, string>({
            query: (tenantId) => ({
                url: `/ lease / ${tenantId}`,
                method: "GET",
            }),
            transformResponse: (data: { result: ILease }) => data.result,
            transformErrorResponse: (error: { status: number, data: { message: string } }) => error.data?.message,
            providesTags: ["lease"],
        }),

        applyForRental: builder.mutation<string, IRentalAgreement>({
            query: (data) => ({
                url: "/apply",
                method: "POST",
                body: data,
            }),
            transformResponse: (data: { result: string }) => data.result,
            transformErrorResponse: (error: { status: number, data: { message: string } }) => error.data?.message,
            invalidatesTags: ["rental"],
        }),

        browseProperties: builder.query<IProperty[], void>({
            query: () => ({
                url: "/browse",
                method: "GET",
            }),
            transformResponse: (data: { result: IProperty[] }) => data.result,
            transformErrorResponse: (error: { status: number, data: { message: string } }) => error.data?.message,
            providesTags: ["property"],
        }),

        requestMaintenance: builder.mutation<string, IMaintenanceRequest>({
            query: (data) => ({
                url: "/maintenance",
                method: "POST",
                body: data,
            }),
            transformResponse: (data: { result: string }) => data.result,

            transformErrorResponse: (error: { status: number, data: { message: string } }) => error.data?.message,
            invalidatesTags: ["rental"],
        }),

        viewNotifications: builder.query<INotification[], string>({
            query: (tenantId) => ({
                url: `/ view - notifications / ${tenantId} `,
                method: "GET",
            }),
            transformResponse: (data: { result: INotification[] }) => data.result,
            transformErrorResponse: (error: { status: number, data: { message: string } }) => error.data?.message,
            providesTags: ["notification"],
        }),
    }),
});

export const {
    useSignRentalAgreementMutation,
    useGetLeaseDetailsQuery,
    useApplyForRentalMutation,
    useBrowsePropertiesQuery,
    useRequestMaintenanceMutation,
    useViewNotificationsQuery,
} = rentalServiceApi;
