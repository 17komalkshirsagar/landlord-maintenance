import { createApi } from "@reduxjs/toolkit/query/react";
import { createCustomBaseQuery } from "./customBaseQuery.api";

const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin`;
const customBaseQuery = createCustomBaseQuery(baseUrl);

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

interface RecentItem {
    _id: string;
    createdAt: string;

}
interface PropertyItem {
    _id: string;
    name: string;
    address: string;
    createdAt: string;

    landlord?: {
        _id: string;
        name: string;
    };
}
interface DashboardResponse {
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

export const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: customBaseQuery,
    tagTypes: ["admin"],
    endpoints: (builder) => ({
        getDashboardData: builder.query<DashboardResponse, void>({
            query: () => ({
                url: "/dashboard",
                method: "GET",
            }),
            transformResponse: (data: DashboardResponse) => data,
            transformErrorResponse: (error: { status: number; data: { message: string } }) =>
                error.data?.message,
            providesTags: ["admin"],
        }),
    }),
});
export const {
    useGetDashboardDataQuery,
} = adminApi;

