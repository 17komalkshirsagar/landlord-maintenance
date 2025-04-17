


import { createApi } from "@reduxjs/toolkit/query/react";
import { createCustomBaseQuery } from "./customBaseQuery.api";

const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/v1/landlord`
const customBaseQuery = createCustomBaseQuery(baseUrl);

export interface ILease {
    _id?: string;
    tenant: string;
    property: string;
    startDate: string;
    endDate: string;
    rentAmount: string;
    securityDeposit: string;
    terms: string;
    status: "active" | "terminated";
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
}
interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
interface GetAllLeaseResponse {
    result: ILease[];
    pagination: Pagination;
}

export const leaseApi = createApi({
    reducerPath: "leaseApi",
    baseQuery: customBaseQuery,
    tagTypes: ["lease"],

    endpoints: (builder) => ({
        getAllLeases: builder.query<GetAllLeaseResponse, { search?: string; page?: number; limit?: number; isFetchAll?: boolean }>({
            query: ({ search, page, limit, isFetchAll }) => ({
                url: `/get-all-leases`,
                method: "GET",
                params: { search, page, limit, isFetchAll },
            }),
            transformResponse: (data: GetAllLeaseResponse) => data,
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data?.message,
            providesTags: ["lease"],
        }),

        getLeaseById: builder.query<ILease, string>({
            query: (id) => ({
                url: `/get-lease/${id}`,
                method: "GET",
            }),
            transformResponse: (data: { result: ILease }) => data.result,
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data?.message,
            providesTags: ["lease"],
        }),

        createLease: builder.mutation<ILease, Partial<ILease>>({
            query: (leaseData) => ({
                url: "/create-lease",
                method: "POST",
                body: leaseData,
            }),
            transformResponse: (data: { result: ILease }) => data.result,
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data?.message,
            invalidatesTags: ["lease"],
        }),

        updateLease: builder.mutation<ILease, { id: string; leaseData: Partial<ILease> }>({
            query: ({ id, leaseData }) => ({
                url: `/update-lease/${id}`,
                method: "PUT",
                body: leaseData,
            }),
            transformResponse: (data: { result: ILease }) => data.result,
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data?.message,
            invalidatesTags: ["lease"],
        }),

        terminateLease: builder.mutation<ILease, string>({
            query: (id) => ({
                url: `/terminate-lease/${id}`,
                method: "PUT",
            }),
            transformResponse: (data: { result: ILease }) => data.result,
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data?.message,
            invalidatesTags: ["lease"],
        }),
        deleteLease: builder.mutation<string, string>({
            query: (id) => ({
                url: `/delete-lease/${id}`,
                method: "DELETE",
            }),
            transformResponse: (data: { result: string }) => data.result,
            transformErrorResponse: (error: { status: number; data: { message: string } }) =>
                error.data?.message,
            invalidatesTags: ["lease"],
        }),
    }),
});

export const {
    useGetAllLeasesQuery,
    useGetLeaseByIdQuery,
    useCreateLeaseMutation,
    useUpdateLeaseMutation,
    useTerminateLeaseMutation,
    useDeleteLeaseMutation
} = leaseApi;

