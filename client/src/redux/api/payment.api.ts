import { createApi } from "@reduxjs/toolkit/query/react";
import { createCustomBaseQuery } from "./customBaseQuery.api";

export interface Payment {
    _id: string;
    tenant: string;
    property: string;
    amount: number;
    paymentType: "rent" | "tax" | "utility";
    paymentDate: string;
    paymentMethod: "creditCard" | "debitCard" | "bankTransfer" | "cash";
    status: "pending" | "completed" | "failed";
    isDeleted?: boolean;

}

export interface CreatePaymentData {
    tenant: string;
    property: string;
    amount: number;
    paymentType: "rent" | "tax" | "utility";
    paymentDate: string;
    paymentMethod: "creditCard" | "debitCard" | "bankTransfer" | "cash";
    status: "pending" | "completed" | "failed";
    date: string;
}

export interface UpdatePaymentStatusData {
    paymentId: string;
    status: "pending" | "completed" | "failed";
}
interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
interface GetAllPaymentResponse {
    result: Payment[];
    pagination: Pagination;
}

export interface IPaymentQuery {
    search: string;
    page: number;
    limit: number;
    isFetchAll?: boolean;

}
const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/v1/landlord`
const customBaseQuery = createCustomBaseQuery(baseUrl);

export const paymentApi = createApi({
    reducerPath: "paymentApi",
    baseQuery: customBaseQuery,
    tagTypes: ["Payment"],

    endpoints: (builder) => ({
        createPayment: builder.mutation<Payment, CreatePaymentData>({
            query: (PaymentData) => ({
                url: "/create/payment",
                method: "POST",
                body: PaymentData,
            }),
            transformResponse: (data: { result: Payment }) => {
                return data.result;
            },
            transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                return error.data?.message;
            },
            invalidatesTags: ["Payment"],
        }),

        getAllPayments: builder.query<GetAllPaymentResponse, IPaymentQuery>({
            query: ({ search, page, limit, isFetchAll }) => ({
                url: "/all/payment",
                method: "GET",
                params: { search, page, limit, isFetchAll }
            }),
            transformResponse: (data: GetAllPaymentResponse) => {
                return data
            },
            transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                return error.data?.message;
            },
            providesTags: ["Payment"],
        }),

        getPaymentsById: builder.query<Payment[], { id: string }>({
            query: ({ id }) => ({
                url: `/tenant-payment/${id}`,
                method: "GET",
            }),
            transformResponse: (data: { result: Payment[] }) => {
                return data.result;
            },
            transformErrorResponse: (error: { status: number; data: { message: string } }) => {
                return error.data?.message;
            },
            providesTags: ["Payment"],
        }),


        updatePaymentStatus: builder.mutation<Payment, UpdatePaymentStatusData>({
            query: ({ paymentId, status }) => ({
                url: `/update-payment-status/${paymentId}`,
                method: "PUT",
                body: { status },
            }),
            transformResponse: (data: { result: Payment }) => {
                return data.result;
            },
            transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                return error.data?.message;
            },
            invalidatesTags: ["Payment"],
        }),

        deletePayment: builder.mutation<Payment, { id: string }>({
            query: ({ id }) => ({
                url: `/delete-payment/${id}`,
                method: "DELETE",
            }),
            transformResponse: (data: { result: Payment }) => {
                return data.result;
            },
            transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                return error.data?.message;
            },
            invalidatesTags: ["Payment"],
        }),
    }),
});

export const {
    useCreatePaymentMutation,
    useGetAllPaymentsQuery,
    useGetPaymentsByIdQuery,
    useUpdatePaymentStatusMutation,
    useDeletePaymentMutation,
} = paymentApi;
