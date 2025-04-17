import { createApi } from "@reduxjs/toolkit/query/react";
import { createCustomBaseQuery } from "./customBaseQuery.api";

const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/v1/landlord`
const customBaseQuery = createCustomBaseQuery(baseUrl);
export interface ITax {
    _id?: string;
    property: string;
    taxType: "property tax" | "building tax" | "holding tax" | "tower tax";
    taxAmount: number;
    dueDate: string;
    paid: boolean;
    isDeleted?: boolean;
}

export interface ITaxResponse {
    success: boolean;
    message: string;
    tax?: ITax;
}

export interface ITaxQuery {
    search?: string;
    page?: number;
    limit?: number;
    isFetchAll?: boolean
}
interface Pagination {
    search: string;
    page: number;
    limit: number;
    isFetchAll?: boolean;
    totalPages?: number;
}
interface GetAllTaxResponse {
    result: ITax[];
    pagination?: Pagination;
}

export const taxApi = createApi({
    reducerPath: "taxApi",
    baseQuery: customBaseQuery,
    tagTypes: ["Tax"],

    endpoints: (builder) => ({
        getAllTaxes: builder.query<GetAllTaxResponse, ITaxQuery>({
            query: ({ search, page, limit, isFetchAll }) => ({
                url: `/get-all-tax`,
                method: "GET",
                params: { search, page, limit, isFetchAll }
            }),
            transformResponse: (data: GetAllTaxResponse) => data,
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data?.message,
            providesTags: ["Tax"],
        }),


        getTaxesId: builder.query<ITax, string>({
            query: (id) => ({
                url: `/taxes-by-property/${id}`,
                method: "GET",
            }),
            transformResponse: (data: { result: ITax }) => data.result,
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data?.message,
            providesTags: ["Tax"],
        }),

        createTax: builder.mutation<ITaxResponse, Partial<ITax>>({
            query: (taxData) => ({
                url: "/create-all-bills-tax",
                method: "POST",
                body: taxData,
            }),
            transformResponse: (data: { result: ITaxResponse }) => data.result,
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data?.message,
            invalidatesTags: ["Tax"],
        }),

        updateTax: builder.mutation<ITaxResponse, { id: string; data: Partial<ITax> }>({
            query: ({ id, data }) => ({
                url: `/update-tax/${id}`,
                method: "PUT",
                body: data,
            }),
            transformResponse: (data: { result: ITaxResponse }) => data.result,
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data?.message,
            invalidatesTags: ["Tax"],
        }),

        deleteTax: builder.mutation<ITaxResponse, string>({
            query: (id) => ({
                url: `/delete-tax/${id}`,
                method: "DELETE",
            }),
            transformResponse: (data: { result: ITaxResponse }) => data.result,
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data?.message,
            invalidatesTags: ["Tax"],
        }),
    }),
});

export const {
    useGetAllTaxesQuery,
    useGetTaxesIdQuery,

    useCreateTaxMutation,
    useUpdateTaxMutation,
    useDeleteTaxMutation,
} = taxApi;
