import { createApi } from "@reduxjs/toolkit/query/react";
import { createCustomBaseQuery } from "./customBaseQuery.api";

const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/v1/landlord`
const customBaseQuery = createCustomBaseQuery(baseUrl);

export interface IRentalAgreement {
    _id?: string;
    tenant: string;
    property: string;
    startDate: string;
    endDate: string;
    monthlyRent: number;
    contractRenewalDate: string;
    status: "active" | "expired";
    isDeleted?: boolean;
    agreements?: string
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
interface GetAllRentalAgreementResponse {
    agreements: IRentalAgreement[];
    pagination: Pagination;
    result: IRentalAgreement[]
    _id?: string;

    tenant: string;
    property: string;
    startDate: string;
    endDate: string;
    monthlyRent: number;
    contractRenewalDate: string;
    status: "active" | "expired";
    isDeleted?: boolean;

}

export const rentalApi = createApi({
    reducerPath: "rentalApi",
    baseQuery: customBaseQuery,
    tagTypes: ["RentalAgreement"],

    endpoints: (builder) => ({
        getAllRentalAgreements: builder.query<GetAllRentalAgreementResponse, { page?: number; limit?: number; isFetchAll?: boolean; search?: string }>({
            query: ({ page, limit, isFetchAll, search }) => ({
                url: "/all/rental/agreement",
                method: "GET",
                params: { page, limit, isFetchAll, currentSearch: search, },
            }),
            transformResponse: (data: GetAllRentalAgreementResponse) => data,
            transformErrorResponse: (error: any) => ({ message: error?.data?.message }),
            providesTags: ["RentalAgreement"],
        }),


        getRentalAgreementByTenant: builder.query<GetAllRentalAgreementResponse, string>({
            query: (id) => ({
                url: `/get-tenant-rental-agreement/${id}`,
                method: "GET",
            }),
            transformResponse: (data: { agreements: GetAllRentalAgreementResponse }) => data.agreements,
            transformErrorResponse: (error: any) => ({ message: error.data.message }),
            providesTags: ["RentalAgreement"],
        }),

        createRentalAgreement: builder.mutation<{ message: string }, IRentalAgreement>({
            query: (agreementData) => ({
                url: "/create/rental-agreement",
                method: "POST",
                body: agreementData,
            }),
            transformResponse: (data: { result: string }) => ({ message: data.result }),
            transformErrorResponse: (error: any) => ({ message: error.data.message }),
            invalidatesTags: ["RentalAgreement"],
        }),

        updateRentalAgreement: builder.mutation<{ message: string }, { id: string } & IRentalAgreement>({
            query: ({ id, ...rest }) => ({
                url: `/update-rental-agreement/${id}`,
                method: "PUT",
                body: rest,
            }),
            transformResponse: (data: { result: string }) => ({ message: data.result }),
            transformErrorResponse: (error: any) => ({ message: error.data.message }),
            invalidatesTags: ["RentalAgreement"],
        }),


        deleteRentalAgreement: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/delete-rental-agreement/${id}`,
                method: "DELETE",
            }),
            transformResponse: (data: { result: string }) => ({ message: data.result }),
            transformErrorResponse: (error: any) => ({ message: error.data.message }),
            invalidatesTags: ["RentalAgreement"],
        }),

        terminateRentalAgreement: builder.mutation<{ message: string }, string>({
            query: (agreementId) => ({
                url: `/terminate-rental-agreement/${agreementId}`,
                method: "DELETE",
            }),
            transformResponse: (data: { result: string }) => ({ message: data.result }),
            transformErrorResponse: (error: any) => ({ message: error.data.message }),
            invalidatesTags: ["RentalAgreement"],
        }),
    }),
});

export const {
    useGetAllRentalAgreementsQuery,
    useGetRentalAgreementByTenantQuery,
    useCreateRentalAgreementMutation,
    useUpdateRentalAgreementMutation,
    useDeleteRentalAgreementMutation,
    useTerminateRentalAgreementMutation,
} = rentalApi;
