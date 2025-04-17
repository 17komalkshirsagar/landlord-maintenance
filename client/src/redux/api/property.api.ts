

import { createApi } from "@reduxjs/toolkit/query/react";
import { createCustomBaseQuery } from "./customBaseQuery.api";

const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/v1/landlord`;
const customBaseQuery = createCustomBaseQuery(baseUrl);


export interface IProperty {
    _id: string;
    id: string;
    landlord: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    type: "residential" | "commercial";
    rentAmount: number;
    status: "available" | "rented";
    isDeleted?: boolean;
}

export interface IPropertyResponse {
    success: boolean;
    message: string;
    property?: IProperty;
    result: IProperty[];

    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface IPropertyQuery {
    search: string;
    page: number;
    limit: number;
}

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface SearchData {
    properties: any[];
    pagination: Pagination;
}

export const propertyApi = createApi({
    reducerPath: "propertyApi",
    baseQuery: customBaseQuery,
    tagTypes: ["Property"],

    endpoints: (builder) => ({
        getAllProperties: builder.query<IPropertyResponse, IPropertyQuery>({
            query: ({ search, page, limit }) => ({
                url: "/get-all-property",
                method: "GET",
                params: { search, page, limit },
            }),
            transformResponse: (data: IPropertyResponse) => data,
            providesTags: ["Property"],
        }),

        getPropertyById: builder.query<IProperty, string>({
            query: (id) => ({
                url: `/get-property/${id}`,
                method: "GET",
            }),
            transformResponse: (data: { result: IProperty }) => data.result,
            transformErrorResponse: (error: { status: number; data: { message: string } }) =>
                error.data?.message,
            providesTags: ["Property"],
        }),

        createProperty: builder.mutation<IPropertyResponse, Partial<IProperty>>({
            query: (propertyData) => ({
                url: "/create-property",
                method: "POST",
                body: propertyData,
            }),
            transformResponse: (data: { result: IPropertyResponse }) => data.result,
            transformErrorResponse: (error: { status: number; data: { message: string } }) =>
                error.data?.message,
            invalidatesTags: ["Property"],
        }),

        updateProperty: builder.mutation<
            IPropertyResponse,
            { id: string; updatedData: Partial<IProperty> }
        >({
            query: ({ id, updatedData }) => ({
                url: `/update-property/${id}`,
                method: "PUT",
                body: updatedData,
            }),
            transformResponse: (data: { result: IPropertyResponse }) => data.result,
            transformErrorResponse: (error: { status: number; data: { message: string } }) =>
                error.data?.message,
            invalidatesTags: ["Property"],
        }),

        deleteProperty: builder.mutation<IPropertyResponse, string>({
            query: (id) => ({
                url: `/delete-property/${id}`,
                method: "DELETE",
            }),
            transformResponse: (data: { result: IPropertyResponse }) => data.result,
            transformErrorResponse: (error: { status: number; data: { message: string } }) =>
                error.data?.message,
            invalidatesTags: ["Property"],
        }),

        paymentSuccess: builder.mutation<
            { message: string },
            { landlordId: string; razorpay_payment_id: string }
        >({
            query: (paymentData) => ({
                url: "/payment/success",
                method: "POST",
                body: paymentData,

            }),
        }),
    }),
});


export const {
    useGetAllPropertiesQuery,
    useGetPropertyByIdQuery,
    useCreatePropertyMutation,
    useUpdatePropertyMutation,
    useDeletePropertyMutation,
    usePaymentSuccessMutation,
} = propertyApi;
