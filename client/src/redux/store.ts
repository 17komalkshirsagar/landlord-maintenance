import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/auth.api";

import authSlice from "./../slices/auth.slice"
import { billsApi } from "./api/bill.api";
import { contractApi } from "./api/contracts.api";
import { rentalApi } from "./api/createRentalAgreement.api";
import { landlordApi } from "./api/Landlord.api";
import { leaseApi } from "./api/leases.api";
import { maintenanceApi } from "./api/maintance.api";
import { notificationApi } from "./api/notification.api";
import { paymentApi } from "./api/payment.api";
import { propertyApi } from "./api/property.api";
import { rentalServiceApi } from "./api/rental.api";
import { taxApi } from "./api/tax.api";
import { tenantApi } from "./api/tenant.api";
import { tenantHistoryApi } from "./api/tenantHistory.api";
import { adminApi } from "./api/admin.api";
import { rezorpayApi } from "./api/rezorpay.api";




const reduxStore = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [billsApi.reducerPath]: billsApi.reducer,
        [contractApi.reducerPath]: contractApi.reducer,
        [rentalApi.reducerPath]: rentalApi.reducer,
        [landlordApi.reducerPath]: landlordApi.reducer,
        [leaseApi.reducerPath]: leaseApi.reducer,
        [maintenanceApi.reducerPath]: maintenanceApi.reducer,
        [notificationApi.reducerPath]: notificationApi.reducer,
        [paymentApi.reducerPath]: paymentApi.reducer,
        [propertyApi.reducerPath]: propertyApi.reducer,
        [rentalServiceApi.reducerPath]: rentalServiceApi.reducer,
        [taxApi.reducerPath]: taxApi.reducer,
        [tenantApi.reducerPath]: tenantApi.reducer,
        [tenantHistoryApi.reducerPath]: tenantHistoryApi.reducer,
        [adminApi.reducerPath]: adminApi.reducer,
        [rezorpayApi.reducerPath]: rezorpayApi.reducer,

        auth: authSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            maintenanceApi.middleware,
            notificationApi.middleware,
            paymentApi.middleware,
            propertyApi.middleware,
            rentalServiceApi.middleware,
            taxApi.middleware,
            tenantApi.middleware,
            tenantHistoryApi.middleware,

            leaseApi.middleware,
            landlordApi.middleware,
            rentalApi.middleware,
            contractApi.middleware,
            billsApi.middleware,
            authApi.middleware,
            rezorpayApi.middleware,
            adminApi.middleware

        )
})


export type RootState = ReturnType<typeof reduxStore.getState>
export type AppDispatch = typeof reduxStore.dispatch

export default reduxStore

