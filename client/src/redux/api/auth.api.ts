import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react"
import { logoutUser, logoutLandlord, logoutAdmin, openSessionExpiredModal } from "../../slices/auth.slice";
import { RootState } from "../store";
import { ILandlord } from "../../../../server/modals/Landlord";
import { IAdmin } from "../../../../server/modals/Admin";


const baseQuery = fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth`,
    credentials: "include",
    prepareHeaders(headers, { getState }) {
        const state = getState() as RootState;
        const token = state.auth.user?.token;
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

const customBaseQuery: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args: any, api: any, extraOptions: any) => {
    const response = await baseQuery(args, api, extraOptions);

    if (response.error?.status === 401) {
        const errorData = response.error.data as { message?: string };
        if (errorData?.message === "Session has expired. Please log in again.") {
            api.dispatch(logoutUser());
            api.dispatch(logoutAdmin());
            api.dispatch(logoutLandlord());
            api.dispatch(openSessionExpiredModal())
        }
    }

    return response;
};


export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: customBaseQuery,
    tagTypes: ["user", "admin", "landlord"],
    endpoints: (builder) => {
        return {
            registerAdmin: builder.mutation({
                query: adminData => {
                    return {
                        url: "/register",
                        method: "POST",
                        body: adminData
                    }
                },
                transformResponse: (data: { message: string, result: IAdmin }) => {
                    localStorage.setItem("admin", JSON.stringify(data.result))
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data?.message
                }
            }),

            signIn: builder.mutation({
                query: (adminData) => {
                    return {
                        url: "/login",
                        method: "POST",
                        body: adminData
                    }
                },
                transformResponse: (data: { message: string, result: IAdmin }) => {
                    localStorage.setItem("admin", JSON.stringify(data.result))
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data?.message
                }
            }),

            //     query: (credentials: { identifier: string }) => ({
            //         url: "/login",
            //         method: "POST",
            //         body: {
            //             email: credentials.identifier,
            //             mobile: credentials.identifier
            //         }
            //     }),
            //     transformResponse: (data: { message: string, result: IAdmin }) => {
            //         localStorage.setItem("admin", JSON.stringify(data.result));
            //         return data;
            //     },
            //     transformErrorResponse: (error: { status: number, data: { message: string } }) => {
            //         return error.data?.message;
            //     }
            // }),

            verifyOTP: builder.mutation({
                query: (adminData) => {
                    return {
                        url: "/verify-otp",
                        method: "POST",
                        body: adminData
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data?.message
                }
            }),

            logoutAdmin: builder.mutation({
                query: (adminData) => {
                    return {
                        url: "/logout",
                        method: "POST",
                        body: adminData
                    }
                },
                transformResponse: (data: { message: string }) => {
                    localStorage.removeItem("admin")
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data?.message
                }

            }),

            registerLandlord: builder.mutation({
                query: (landlordData) => ({
                    url: "/register/landlord",
                    method: "POST",
                    body: landlordData,
                }),

                transformResponse: (data: { message: string, result: ILandlord }) => {
                    localStorage.setItem("landlord", JSON.stringify(data.result))
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data?.message
                }
            }),

            loginLandlord: builder.mutation({
                query: (landlordData) => ({
                    url: "/login/landlord",
                    method: "POST",
                    body: landlordData,
                }),
                transformResponse: (data: { message: string, result: ILandlord }) => {
                    localStorage.setItem("landlord", JSON.stringify(data.result))
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data?.message
                }
            }),

            verifyLandlordOTP: builder.mutation({
                query: (otpData) => ({
                    url: "/verify-otp/landlord",
                    method: "POST",
                    body: otpData,
                }),
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data?.message
                }
            }),

            logoutLandlord: builder.mutation({
                query: () => ({
                    url: "/logout/landlord",
                    method: "POST",
                }),
                transformResponse: (data: { message: string }) => {
                    localStorage.removeItem("landlord")
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data?.message
                }
            }),


            continueWithGoogle: builder.mutation({
                query: (googleData) => ({
                    url: "/continue-with-google",
                    method: "POST",
                    body: googleData,
                }),
                transformResponse: (data: { message: string; result: ILandlord }) => {
                    localStorage.setItem("landlord", JSON.stringify(data.result));
                    return data;
                },
                transformErrorResponse: (error: { status: number; data: { message: string } }) => {
                    return error.data?.message || "Google login failed";
                },
            }),








        }
    }
})

export const {
    useRegisterAdminMutation,
    useSignInMutation,
    useVerifyOTPMutation,
    useLogoutAdminMutation,

    useRegisterLandlordMutation,
    useLoginLandlordMutation,
    useVerifyLandlordOTPMutation,
    useLogoutLandlordMutation,
    useContinueWithGoogleMutation,


} = authApi




