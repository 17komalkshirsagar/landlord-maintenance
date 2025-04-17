import { createApi } from "@reduxjs/toolkit/query/react";
import { createCustomBaseQuery } from "./customBaseQuery.api";

interface CreateOrderRequest {
    amount: number;
}

interface CreateOrderResponse {
    message: string;
    id: string;
    result: {
        orderId: string;
    };
    status: string;
}

interface PlaceOrderRequest {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    name: string;
    price: number;
    paymentId: string;
    landlord: string;
    orderId: string;
    signature: string;
}




interface GenericResponse {
    message: string;
}

interface PaymentRecord {
    _id: string;
    name: string;
    price: number;

    orderId: string
    status: "paid";
    createdAt: string;
}
interface VerifyPaymentRequest {
    paymentId: string;
    signature: string;
    orderId: string;

}

interface VerifyPaymentResponse {
    message: string;
    verified: boolean;
    orderId: string;
}

const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/v1/payment`;
const customBaseQuery = createCustomBaseQuery(baseUrl);

export const rezorpayApi = createApi({
    reducerPath: "rezorpayApi",
    baseQuery: customBaseQuery,
    tagTypes: ["rezorpay"],

    endpoints: (builder) => ({

        initiateOrder: builder.mutation<CreateOrderResponse, CreateOrderRequest>({
            query: (rezorpayData) => ({
                url: "/rezorpay/create-order",
                method: "POST",
                body: rezorpayData,
            }),
            transformErrorResponse: (error: { status: number; data: { message: string } }) =>
                error.data?.message,
            invalidatesTags: ["rezorpay"],
        }),

        placePropertiesOrderPayment: builder.mutation<GenericResponse, PlaceOrderRequest>({
            query: (rezorpayData) => ({
                url: "/rezorpay/payment-success",
                method: "POST",
                body: rezorpayData,
            }),
            transformResponse: (data: GenericResponse) => data,
            transformErrorResponse: (error: { status: number; data: { message: string } }) =>
                error.data?.message,
            invalidatesTags: ["rezorpay"],
        }),

        getAllPropertiesPayment: builder.query<PaymentRecord[], void>({
            query: () => ({
                url: "/rezorpay/payments",
                method: "GET",
            }),
            transformResponse: (data: { result: PaymentRecord[] }) => data.result,
            transformErrorResponse: (error: { status: number; data: { message: string } }) =>
                error.data?.message,
            providesTags: ["rezorpay"],
        }),
        verifyPayment: builder.mutation<VerifyPaymentResponse, VerifyPaymentRequest>({
            query: (body) => ({
                url: "/rezorpay/verify-payment",
                method: "POST",
                body
            }),
            transformResponse: (data: VerifyPaymentResponse) => data,
            transformErrorResponse: (error: { status: number; data: { message: string } }) =>
                error.data?.message,
            invalidatesTags: ["rezorpay"],
        }),

        deleteRezorPayment: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/payment/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["rezorpay"],
        }),

    }),
});

export const {
    useInitiateOrderMutation,
    usePlacePropertiesOrderPaymentMutation,
    useGetAllPropertiesPaymentQuery, useVerifyPaymentMutation,
    useDeleteRezorPaymentMutation
} = rezorpayApi;
