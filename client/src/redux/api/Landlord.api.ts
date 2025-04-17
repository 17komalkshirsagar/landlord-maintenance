import { createApi } from "@reduxjs/toolkit/query/react";
import { createCustomBaseQuery } from "./customBaseQuery.api";

const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/v1/landlord`
const customBaseQuery = createCustomBaseQuery(baseUrl);

export interface ILandlord {
    _id?: string;
    name: string;
    mobile: number;
    otp?: string;
    email: string;
    image: string;
    isBlock?: boolean;
    lastLogin?: Date;
    otpExpire?: Date;
    isDeleted?: boolean;
    status?: "active" | "inactive";
}
interface DashboardTotals {
    landlords: number;
    tenants: number;
    properties: number;
    leases: number;
    contracts: number;
    tenantHistory: number;
    maintenance: number;
    tax: number;
    bills: number;
    payments: number;
    agreements: number;
}
type PropertyItem = any;
interface RecentItem {
    _id: string;
    createdAt: string;

}

interface LandlordResponse {
    result: ILandlord[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    paidForExtraProperties: boolean;
}
interface LandlordDashboardResponse {
    message: string;
    data: {
        totals: DashboardTotals;
        recent: {
            payments: RecentItem[];
            tenants: RecentItem[];
            maintenance: RecentItem[];
            properties: PropertyItem[]
        };
    };
}
export const landlordApi = createApi({
    reducerPath: "landlordApi",
    baseQuery: customBaseQuery,
    tagTypes: ["Landlord"],

    endpoints: (builder) => ({
        approveLandlord: builder.mutation<{ ILandlord: string }, string>({
            query: (id) => ({
                url: `/landlord/approve/${id}`,
                method: "PUT",
            }),
            transformResponse: (result: { message: string }) => ({ ILandlord: result.message }),
            transformErrorResponse: (error: any) => ({ message: error.data?.message }),
            invalidatesTags: ["Landlord"],
        }),

        blockLandlord: builder.mutation<{ ILandlord: string }, string>({
            query: (id) => ({
                url: `/landlord/block/${id}`,
                method: "PUT",
            }),
            transformResponse: (data: { result: string }) => ({ ILandlord: data.result }),
            transformErrorResponse: (error: any) => ({ message: error.data?.message }),
            invalidatesTags: ["Landlord"],
        }),

        blockTenant: builder.mutation<{ ILandlord: string }, string>({
            query: (tenantId) => ({
                url: `/tenant/block/${tenantId}`,
                method: "PUT",
            }),
            transformResponse: (data: { result: string }) => ({ ILandlord: data.result }),
            transformErrorResponse: (error: any) => ({ message: error.data?.message }),
            invalidatesTags: ["Landlord"],
        }),

        getAllLandlord: builder.query<LandlordResponse, { search?: string; page?: number; limit?: number }>({
            query: ({ search, page, limit }) => ({
                url: '/landlord/get',
                method: "GET",
                params: { search, page, limit },
            }),
            transformResponse: (data: LandlordResponse) => data,

            transformErrorResponse: (error: any) => ({
                message: error?.data?.message || "An error occurred"
            }),
            providesTags: ["Landlord"],
        }),






        getAllProperties: builder.query<{ properties: any[] }, { search?: string; page?: number; limit?: number }>({
            query: ({ search = '', page = 1, limit = 10 }) => ({
                url: "/get-all-property",
                method: "GET",
                params: { search, page, limit },
            }),
            transformResponse: (data: { properties: any[] }) => data,
            transformErrorResponse: (error: any) => ({ message: error.data?.message }),
            providesTags: ["Landlord"],
        }),


        monitorPayments: builder.query<{ payments: any[] }, void>({
            query: () => ({
                url: "/payments",
                method: "GET",
            }),
            transformResponse: (data: { payments: any[] }) => data,
            transformErrorResponse: (error: any) => ({ message: error.data?.message }),
            providesTags: ["Landlord"],
        }),

        reviewTaxes: builder.query<{ taxes: any[] }, void>({
            query: () => ({
                url: "/taxes",
                method: "GET",
            }),
            transformResponse: (data: { taxes: any[] }) => data,
            transformErrorResponse: (error: any) => ({ message: error.data?.message }),
            providesTags: ["Landlord"],
        }),

        reviewUtilityBills: builder.query<{ utilityBills: any[] }, void>({
            query: () => ({
                url: "/utility-bills",
                method: "GET",
            }),
            transformResponse: (data: { utilityBills: any[] }) => data,
            transformErrorResponse: (error: any) => ({ message: error.data?.message }),
            providesTags: ["Landlord"],
        }),

        sendNotification: builder.mutation<{ message: string }, { title: string; body: string }>({
            query: (notificationData) => ({
                url: "/notifications",
                method: "POST",
                body: notificationData,
            }),
            transformResponse: (data: { message: string }) => ({ message: data.message }),
            transformErrorResponse: (error: any) => ({ message: error.data?.message }),
            invalidatesTags: ["Landlord"],
        }),

        approveContract: builder.mutation<{ message: string }, string>({
            query: (contractId) => ({
                url: `/contracts/approve/${contractId}`,
                method: "PUT",
            }),
            transformResponse: (data: { message: string }) => ({ message: data.message }),
            transformErrorResponse: (error: any) => ({ message: error.data?.message }),
            invalidatesTags: ["Landlord"],
        }),

        getLandlordData: builder.query<LandlordDashboardResponse, void>({
            query: () => ({
                url: "/landlord/dashboard",
                method: "GET",
            }),
            transformResponse: (data: LandlordDashboardResponse) => data,
            transformErrorResponse: (error: { status: number; data: { message: string } }) =>
                error.data?.message,
            providesTags: ["Landlord"],
        }),
    }),
});

export const {
    // useGetAllLandlaordQuery,
    useGetAllLandlordQuery,
    useApproveLandlordMutation,
    useBlockLandlordMutation,
    useBlockTenantMutation,
    useGetAllPropertiesQuery,
    useMonitorPaymentsQuery,
    useReviewTaxesQuery,
    useReviewUtilityBillsQuery,
    useSendNotificationMutation,
    useApproveContractMutation,
    useGetLandlordDataQuery
} = landlordApi;
