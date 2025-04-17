import { createApi } from "@reduxjs/toolkit/query/react";
import { createCustomBaseQuery } from "./customBaseQuery.api";

export interface Bill {
    _id: string;
    property: string;
    billType: "electricity" | "water" | "gas";
    amount: number;
    dueDate: Date;
    paid: boolean;
    isDeleted?: boolean;
}

export interface CreateBillData {
    property: string;
    billType: "electricity" | "water" | "gas";
    amount: number;
    dueDate: Date;
}

export interface UpdateBillData {
    billId: string;
    billData: CreateBillData;
}

export interface MarkBillAsPaidData {
    billId: string;
}

export interface PayUtilityBillData {
    billId: string;
    paymentMethod: string;
    amount: number;
}

interface GetAllBillsParams {
    search?: string;
    page?: number;
    limit?: number;
    isFetchAll?: boolean;
}

interface GetAllBillsResponse {
    result: Bill[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }
}
export interface IPropertyQuery {
    search?: string;
    page?: number;
    limit?: number;
}
const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/v1/landlord`
const customBaseQuery = createCustomBaseQuery(baseUrl);

export const billsApi = createApi({
    reducerPath: "billsApi",
    baseQuery: customBaseQuery,
    tagTypes: ["bills"],

    endpoints: (builder) => ({

        getAllBills: builder.query<GetAllBillsResponse, GetAllBillsParams>({
            query: ({ search = "", page = 1, limit = 10, isFetchAll = false }) => ({
                url: "/get-all-bills",
                method: "GET",
                params: { search, page, limit, isFetchAll },
            }),

            transformResponse: (data: { result: any; pagination: any }) => data,
            transformErrorResponse: (error: { status: number; data: { message: string } }) =>
                error.data?.message,
            providesTags: ["bills"],
        }),


        getBillById: builder.query<Bill, string>({
            query: (id) => ({
                url: `/get-bill/${id}`,
                method: "GET",

            }),
            transformResponse: (data: { result: Bill }) => data.result,
            transformErrorResponse: (error: { status: number; data: { message: string } }) =>
                error.data?.message,
            providesTags: ["bills"],
        }),


        createBill: builder.mutation<Bill, CreateBillData>({
            query: (billData) => ({
                url: "/createbill",
                method: "POST",
                body: billData,
            }),
            transformResponse: (data: { result: Bill }) => data.result,
            transformErrorResponse: (error: { status: number; data: { message: string } }) =>
                error.data?.message,
            invalidatesTags: ["bills"],
        }),

        updateBill: builder.mutation<Bill, { id: string; billData: any }>({
            query: ({ id, billData }) => ({
                url: `/update-bill/${id}`,
                method: "PUT",
                body: billData,
            }),
            transformResponse: (data: { result: Bill }) => data.result,
            transformErrorResponse: (error: { status: number; data: { message: string } }) =>
                error.data?.message,
            invalidatesTags: ["bills"],
        }),

        deleteBill: builder.mutation<Bill, { id: string; }>({
            query: ({ id }) => ({
                url: `/delete-bill/${id}`,
                method: "DELETE",

            }),
            transformResponse: (data: { result: Bill }) => data.result,
            transformErrorResponse: (error: { status: number; data: { message: string } }) =>
                error.data?.message,
            invalidatesTags: ["bills"],
        }),




        markBillAsPaid: builder.mutation<Bill, MarkBillAsPaidData>({
            query: ({ billId }) => ({
                url: `/mark-paid/${billId}`,
                method: "PUT",
            }),
            transformResponse: (data: { result: Bill }) => data.result,
            transformErrorResponse: (error: { status: number; data: { message: string } }) =>
                error.data?.message,
            invalidatesTags: ["bills"],
        }),


        payUtilityBills: builder.mutation<string, PayUtilityBillData>({
            query: (paymentData) => ({
                url: "/utility-bills/pay",
                method: "POST",
                body: paymentData,
            }),
            transformResponse: (data: { message: string }) => data.message,
            transformErrorResponse: (error: { status: number; data: { message: string } }) =>
                error.data?.message,
            invalidatesTags: ["bills"],
        }),
    }),
});

export const {
    useGetAllBillsQuery,
    useGetBillByIdQuery,
    useCreateBillMutation,
    useUpdateBillMutation,
    useDeleteBillMutation,
    useMarkBillAsPaidMutation,
    usePayUtilityBillsMutation,
} = billsApi;
