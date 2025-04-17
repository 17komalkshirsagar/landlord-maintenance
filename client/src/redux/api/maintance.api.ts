import { createApi } from "@reduxjs/toolkit/query/react";
import { createCustomBaseQuery } from "./customBaseQuery.api";

const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/v1/landlord`;
const customBaseQuery = createCustomBaseQuery(baseUrl);

export type MaintenanceStatus = "pending" | "inProgress" | "completed";

export interface IMaintenanceRequest {
    _id: string;
    tenant: string;
    property: string;
    description: string;
    status: MaintenanceStatus;
    isDeleted?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateMaintenanceDto {
    tenant: string;
    property: string;
    description: string;
}

export interface UpdateMaintenanceDto {
    description?: string;
    status?: MaintenanceStatus;
}
interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
interface GetAllMaintenanceResponse {
    result: IMaintenanceRequest[];
    pagination: Pagination;
}
export const maintenanceApi = createApi({
    reducerPath: "maintenanceApi",
    baseQuery: customBaseQuery,
    tagTypes: ["maintenance"],

    endpoints: (builder) => ({
        createMaintenanceRequest: builder.mutation<string, CreateMaintenanceDto>({
            query: (maintenanceData) => ({
                url: "/create/maintance",
                method: "POST",
                body: maintenanceData,
            }),
            transformResponse: (data: { result: string }) => data.result,
            transformErrorResponse: (error: { status: number; data: { result: string } }) =>
                error.data?.result,
            invalidatesTags: ["maintenance"],
        }),

        getAllMaintenanceRequests: builder.query<GetAllMaintenanceResponse, { search?: string; page?: number; limit?: number; isFetchAll?: boolean }>({
            query: ({ search, page, limit, isFetchAll }) => ({
                url: "/get-all/maintenance",
                method: "GET",
                params: { search, page, limit, isFetchAll },
            }),
            transformResponse: (data: GetAllMaintenanceResponse) => data,
            transformErrorResponse: (error: { status: number; data: { result: string } }) =>
                error.data?.result,
            providesTags: ["maintenance"],
        }),





        getMaintenanceRequestById: builder.query<IMaintenanceRequest, string>({
            query: (id) => ({
                url: `/get-maintance/${id}`,
                method: "GET",
            }),
            transformResponse: (data: { result: IMaintenanceRequest }) => data.result,
            transformErrorResponse: (error: { status: number; data: { result: string } }) =>
                error.data?.result,
            providesTags: ["maintenance"],
        }),

        updateMaintenanceRequest: builder.mutation<
            string,
            { id: string; maintenanceData: UpdateMaintenanceDto }
        >({
            query: ({ id, maintenanceData }) => ({
                url: `/update-maintance/${id}`,
                method: "PUT",
                body: maintenanceData,
            }),
            transformResponse: (data: { result: string }) => data.result,
            transformErrorResponse: (error: { status: number; data: { result: string } }) =>
                error.data?.result,
            invalidatesTags: ["maintenance"],
        }),

        completeMaintenanceRequest: builder.mutation<string, string>({
            query: (id) => ({
                url: `/complete-maintance/${id}`,
                method: "PUT",
            }),
            transformResponse: (data: { result: string }) => data.result,
            transformErrorResponse: (error: { status: number; data: { result: string } }) =>
                error.data?.result,
            invalidatesTags: ["maintenance"],
        }),

        deleteMaintenanceRequest: builder.mutation<string, string>({
            query: (id) => ({
                url: `/delete-maintance/${id}`,
                method: "DELETE",
            }),
            transformResponse: (data: { result: string }) => data.result,
            transformErrorResponse: (error: { status: number; data: { result: string } }) =>
                error.data?.result,
            invalidatesTags: ["maintenance"],
        }),

        approveMaintenanceRequest: builder.mutation<string, string>({
            query: (id) => ({
                url: `/approve-maintance/${id}`,
                method: "PUT",
            }),
            transformResponse: (data: { result: string }) => data.result,
            transformErrorResponse: (error: { status: number; data: { result: string } }) =>
                error.data?.result,
            invalidatesTags: ["maintenance"],
        }),
    }),
});

export const {
    useCreateMaintenanceRequestMutation,
    useGetAllMaintenanceRequestsQuery,
    useGetMaintenanceRequestByIdQuery,
    useUpdateMaintenanceRequestMutation,
    useCompleteMaintenanceRequestMutation,
    useDeleteMaintenanceRequestMutation,
    useApproveMaintenanceRequestMutation,
} = maintenanceApi;


