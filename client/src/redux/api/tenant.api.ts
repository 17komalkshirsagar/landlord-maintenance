import { createApi } from "@reduxjs/toolkit/query/react";
import { createCustomBaseQuery } from "./customBaseQuery.api";
import mongoose from "mongoose";
const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/v1/landlord`
const customBaseQuery = createCustomBaseQuery(baseUrl);


export interface ITenant {
    _id: string;
    user: mongoose.Schema.Types.ObjectId;
    property: string;
    leaseStart: Date;
    leaseEnd: Date;
    rentAmount: number;
    image: string;
    documents: string[];
    securityDeposit: number;
    status: "pending" | "approved" | "rejected";
    isDeleted?: boolean;
    name: string,
    mobile: string
}
export interface GetAllTenantsParams {
    search?: string;
    page?: number;
    limit?: number;
    isFetchAll?: boolean;
}

export interface Pagination {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

interface GetAllTenantResponse {
    result: ITenant[];
    pagination?: Pagination;
}
export const tenantApi = createApi({
    reducerPath: "tenantApi",
    baseQuery: customBaseQuery,
    tagTypes: ["tenant"],

    endpoints: (builder) => ({
        createTenant: builder.mutation<string, FormData>({
            query: (formData) => ({
                url: "/create-new",
                method: "POST",
                body: formData,
            }),
            transformResponse: (data: { result: string }) => data.result,
            transformErrorResponse: (error: { status: number, data: { message: string } }) => error.data?.message,
            invalidatesTags: ["tenant"],
        }),


        getAllTenants: builder.query<GetAllTenantResponse, GetAllTenantsParams>({
            query: ({ search, page, limit, isFetchAll }) => ({
                url: "/all-tenant",
                method: "GET",
                params: { search, page, limit, isFetchAll },
            }),
            transformResponse: (data: GetAllTenantResponse) => data,
            transformErrorResponse: (error: { status: number; data: { message: string } }) =>
                error.data?.message,
            providesTags: ["tenant"],
        }),


        getTenantById: builder.query<ITenant, string>({
            query: (id) => ({
                url: `/all-tenant/${id}`,
                method: "GET",
            }),
            transformResponse: (data: { result: ITenant }) => data.result,
            transformErrorResponse: (error: { status: number, data: { message: string } }) => error.data?.message,
            providesTags: ["tenant"],
        }),

        updateTenant: builder.mutation<string, { id: string; updatedData: FormData }>({
            query: ({ id, updatedData }) => ({
                url: `/update-tenant/${id}`,
                method: "PUT",
                body: updatedData,
            }),
            transformResponse: (data: { result: string }) => data.result,
            transformErrorResponse: (error: { status: number, data: { message: string } }) => error.data?.message,
            invalidatesTags: ["tenant"],
        }),


        deleteTenant: builder.mutation<string, string>({
            query: (id) => ({
                url: `/delete-tenant/${id}`,
                method: "DELETE",
            }),
            transformResponse: (data: { result: string }) => data.result,
            transformErrorResponse: (error: { status: number, data: { message: string } }) => error.data?.message,
            invalidatesTags: ["tenant"],
        }),

        approveTenant: builder.mutation<string, string>({
            query: (id) => ({
                url: `/approve/${id}`,
                method: "PUT",
            }),
            transformResponse: (data: { result: string }) => data.result,
            transformErrorResponse: (error: { status: number, data: { message: string } }) => error.data?.message,
            invalidatesTags: ["tenant"],
        }),
    }),
});

export const {
    useCreateTenantMutation,
    useGetAllTenantsQuery,
    useGetTenantByIdQuery,
    useUpdateTenantMutation,
    useDeleteTenantMutation,
    useApproveTenantMutation,
} = tenantApi;
