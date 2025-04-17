import { createApi } from "@reduxjs/toolkit/query/react";
import { createCustomBaseQuery } from "./customBaseQuery.api";

interface Contract {
    _id: string;
    property: string;
    tenant: string;
    startDate: string;
    expiryDate: string;
    status: "pending" | "approved" | "rejected";
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

interface CreateContractData {
    property: string;
    tenant: string;
    startDate: string;
    expiryDate: string;
    status?: "pending" | "approved" | "rejected";
}
interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
interface GetAllContractResponse {
    result: Contract[];
    pagination: Pagination;
}
const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/v1/landlord`
const customBaseQuery = createCustomBaseQuery(baseUrl);

export const contractApi = createApi({
    reducerPath: "contractApi",
    baseQuery: customBaseQuery,
    tagTypes: ["contract"],
    endpoints: (builder) => ({
        getAllContracts: builder.query<GetAllContractResponse, { search: string; page: number; limit: number }>({
            query: ({ search, page, limit }) => ({
                url: "/get-all-contracts",
                method: "GET",
                params: { search, page, limit },
            }),
            transformResponse: (data: GetAllContractResponse) => data,
            transformErrorResponse: (error: { status: number; data: { message: string } }) =>
                error.data?.message,
            providesTags: ["contract"],
        }),
        viewRentalAgreements: builder.query<Contract[], void>({
            query: () => ({
                url: "/rental-agreements",
                method: "GET",
            }),
            transformResponse: (data: { result: Contract[] }) => data.result,
            transformErrorResponse: (error: { status: number; data: { message: string } }) =>
                error.data?.message,
            providesTags: ["contract"],
        }),
        getContractById: builder.query<Contract, string>({
            query: (id) => ({
                url: `/get-contract/${id}`,
                method: "GET",
            }),
            transformResponse: (data: { result: Contract }) => data.result,
            transformErrorResponse: (error: { status: number; data: { message: string } }) =>
                error.data?.message,
            providesTags: ["contract"],
        }),
        createContract: builder.mutation<Contract, CreateContractData>({
            query: (contractData) => ({
                url: "/create-contract",
                method: "POST",
                body: contractData,
            }),
            transformResponse: (data: { result: Contract }) => data.result,
            transformErrorResponse: (error: { status: number; data: { message: string } }) =>
                error.data?.message,
            invalidatesTags: ["contract"],
        }),
        updateContract: builder.mutation<Contract, { id: string; contractData: CreateContractData }>({
            query: ({ id, contractData }) => ({
                url: `/update-contract/${id}`,
                method: "PUT",
                body: contractData,
            }),
            transformResponse: (data: { result: Contract }) => data.result,
            transformErrorResponse: (error: { status: number; data: { message: string } }) =>
                error.data?.message,
            invalidatesTags: ["contract"],
        }),
        deleteContract: builder.mutation<string, string>({
            query: (id) => ({
                url: `/delete-contract/${id}`,
                method: "DELETE",
            }),
            transformResponse: (data: { result: string }) => data.result,
            transformErrorResponse: (error: { status: number; data: { message: string } }) =>
                error.data?.message,
            invalidatesTags: ["contract"],
        }),
    }),
});

export const {
    useGetAllContractsQuery,
    useViewRentalAgreementsQuery,
    useGetContractByIdQuery,
    useCreateContractMutation,
    useUpdateContractMutation,
    useDeleteContractMutation,
} = contractApi;
