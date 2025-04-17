import { createApi } from "@reduxjs/toolkit/query/react";
import { createCustomBaseQuery } from "./customBaseQuery.api";
import mongoose from "mongoose";
const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/v1/landlord`
const customBaseQuery = createCustomBaseQuery(baseUrl);
export interface INotification {
    _id?: string;
    user: mongoose.Schema.Types.ObjectId | string;
    message: string;
    seen: boolean;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface INotificationResponse {
    message: string;
}

export interface INotificationQuery {
    page?: number;
    limit?: number;
    isFetchAll?: boolean;
}
export const notificationApi = createApi({
    reducerPath: "notificationApi",
    baseQuery: customBaseQuery,
    tagTypes: ["Notification"],

    endpoints: (builder) => ({
        getAllNotifications: builder.query<INotification[], INotificationQuery>({
            query: ({ page, limit, isFetchAll }) => ({
                url: "/all/notification",
                method: "GET",
                params: { page, limit, isFetchAll },
            }),
            transformResponse: (data: { result: INotification[] }) => data.result,
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data?.message,
            providesTags: ["Notification"],
        }),

        getNotificationsByUser: builder.query<INotification[], string>({
            query: (userId) => ({
                url: `/user-notification/${userId}`,
                method: "GET",
            }),
            transformResponse: (data: { result: INotification[] }) => data.result,
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data?.message,
            providesTags: ["Notification"],
        }),

        createNotification: builder.mutation<INotificationResponse, Partial<INotification>>({
            query: (notificationData) => ({
                url: "/create/notification",
                method: "POST",
                body: notificationData,
            }),
            transformResponse: (data: { result: INotificationResponse }) => {
                return data.result
            },

            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data?.message,
            invalidatesTags: ["Notification"],
        }),

        markAsSeen: builder.mutation<INotificationResponse, string>({
            query: (id) => ({
                url: `/mark-as-seen/${id}`,
                method: "PUT",
            }),
            transformResponse: (data: { result: INotificationResponse }) => {
                return data.result
            },
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data?.message,
            invalidatesTags: ["Notification"],
        }),

        deleteNotification: builder.mutation<INotificationResponse, string>({
            query: (id) => ({
                url: `/delete-notification/${id}`,
                method: "DELETE",
            }),
            transformResponse: (data: { result: INotificationResponse }) => {
                return data.result
            },
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data?.message,
            invalidatesTags: ["Notification"],
        }),

        sendTenantNotification: builder.mutation<INotificationResponse, Partial<INotification>>({
            query: (notificationData) => ({
                url: "/send-tenant-notification",
                method: "POST",
                body: notificationData,
            }),
            transformResponse: (data: { result: INotificationResponse }) => {
                return data.result
            },
            transformErrorResponse: (error: { status: number; data: { message: string } }) => error.data?.message,
            invalidatesTags: ["Notification"],
        }),
    }),
});

export const {
    useGetAllNotificationsQuery,
    useGetNotificationsByUserQuery,
    useCreateNotificationMutation,
    useMarkAsSeenMutation,
    useDeleteNotificationMutation,
    useSendTenantNotificationMutation,
} = notificationApi;
