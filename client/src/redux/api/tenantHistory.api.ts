import { createApi } from "@reduxjs/toolkit/query/react";
import { createCustomBaseQuery } from "./customBaseQuery.api";

const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/v1/landlord`
const customBaseQuery = createCustomBaseQuery(baseUrl);

export interface ITenantHistory {
    _id?: string;

    property: string;
    tenant: string;
    startDate: string;
    endDate?: string;
    isDeleted?: boolean;
}
interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
interface GetAllTenantHistoryResponse {
    result: ITenantHistory[];
    pagination: Pagination;
    property: string;
    tenant: string;
    startDate: string;
    endDate?: string;
    id: string
}
export const tenantHistoryApi = createApi({
    reducerPath: "tenantHistoryApi",
    baseQuery: customBaseQuery,
    tagTypes: ["TenantHistory"],

    endpoints: (builder) => ({
        getAllTenantHistory: builder.query<
            GetAllTenantHistoryResponse,
            { page?: number; limit?: number; isFetchAll?: boolean; search?: string }
        >({
            query: ({ page = 1, limit = 10, isFetchAll = false, search }) => ({
                url: "/all/tenant/history",
                method: "GET",
                params: { page, limit, isFetchAll, search },
            }),
            transformResponse: (data: GetAllTenantHistoryResponse) => data,
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data?.message,
            providesTags: ["TenantHistory"],
        }),








        getTenantHistoryById: builder.query<GetAllTenantHistoryResponse, string>({
            query: (id) => ({
                url: `/property/${id}`,
                method: "GET",
            }),
            transformResponse: (data: { result: GetAllTenantHistoryResponse }) => data.result,

            transformErrorResponse: (error: { status: number; data: { message: string } }) =>
                error.data?.message ?? "Something went wrong",

            providesTags: ["TenantHistory"],
        }),




        createTenantHistory: builder.mutation<{ message: string; result: ITenantHistory }, Partial<ITenantHistory>>({
            query: (historyData) => ({
                url: "/create/tenant/history",
                method: "POST",
                body: historyData,
            }),
            transformResponse: (data: { message: string; result: ITenantHistory }) => ({
                message: data.message,
                result: data.result,
            }),
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data?.message,

            invalidatesTags: ["TenantHistory"],
        }),

        updateTenant: builder.mutation<string, { id: string; historyData: ITenantHistory }>({
            query: ({ id, historyData }) => ({
                url: `/update/history/:id/${id}`,
                method: "PUT",
                body: historyData,
            }),
            transformResponse: (data: { result: string }) => data.result,
            transformErrorResponse: (error: { status: number, data: { message: string } }) => error.data?.message,
            invalidatesTags: ["TenantHistory"],
        }),

        deleteTenantHistory: builder.mutation<{ message: string; result: ITenantHistory }, string>({
            query: (id) => ({
                url: `/delete/tenant/history/${id}`,
                method: "DELETE",
            }),
            transformResponse: (data: { message: string; result: ITenantHistory }) => ({
                message: data.message,
                result: data.result,
            }),
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data?.message,

            invalidatesTags: ["TenantHistory"],
        }),





        viewTenantHistory: builder.query<{ message: string; result: ITenantHistory[] }, void>({
            query: () => ({
                url: "/history/view",
                method: "GET",
            }),
            transformResponse: (data: { message: string; result: ITenantHistory[] }) => ({
                message: data.message,
                result: data.result,
            }),
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data?.message,

            providesTags: ["TenantHistory"],
        }),

    }),
});

export const {
    useGetAllTenantHistoryQuery,
    useGetTenantHistoryByIdQuery,
    useCreateTenantHistoryMutation,
    useDeleteTenantHistoryMutation,
    useViewTenantHistoryQuery,
    useUpdateTenantMutation
} = tenantHistoryApi;
