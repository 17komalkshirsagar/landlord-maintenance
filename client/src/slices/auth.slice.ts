import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "../redux/api/auth.api";


interface IAuthState {
    admin: any | null;
    landlord: any | null;
    user: any | null;
    sessionExpiredOpen: boolean;
}
function parseLocalStorageItem(key: string) {
    try {
        const value = localStorage.getItem(key);
        if (value === "undefined" || value === null) return null;
        return JSON.parse(value);
    } catch (err) {
        console.error(`Error parsing localStorage key "${key}"`, err);
        localStorage.removeItem(key);
        return null;
    }
}

const initialState: IAuthState = {
    admin: parseLocalStorageItem("admin"),
    landlord: parseLocalStorageItem("landlord"),
    user: parseLocalStorageItem("user"),
    sessionExpiredOpen: false,
};


const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        logoutAdmin(state) {
            state.admin = null;
            localStorage.removeItem("admin");
        },
        logoutLandlord(state) {
            state.landlord = null;
            localStorage.removeItem("landlord");
        },
        logoutUser(state) {
            state.user = null;
            localStorage.removeItem("user");
        },
        openSessionExpiredModal(state) {
            state.sessionExpiredOpen = true;
        },
        closeSessionExpiredModal(state) {
            state.sessionExpiredOpen = false;
        },
    },
    extraReducers: (builder) => {
        builder

            .addMatcher(authApi.endpoints.signIn.matchFulfilled, (state, { payload }) => {
                state.admin = payload.result;
                localStorage.setItem("admin", JSON.stringify(payload.result));
            })
            .addMatcher(authApi.endpoints.logoutAdmin.matchFulfilled, (state) => {
                state.admin = null;
                localStorage.removeItem("admin");
            })


            .addMatcher(authApi.endpoints.loginLandlord.matchFulfilled, (state, { payload }) => {
                state.landlord = payload.result;
                localStorage.setItem("landlord", JSON.stringify(payload.result));
            })
            .addMatcher(authApi.endpoints.logoutLandlord.matchFulfilled, (state) => {
                state.landlord = null;
                localStorage.removeItem("landlord");
            })
            .addMatcher(authApi.endpoints.continueWithGoogle.matchFulfilled, (state, { payload }) => {
                state.landlord = payload.result;
            })


    },
});

export const {
    logoutAdmin,
    logoutLandlord,
    logoutUser,
    openSessionExpiredModal,
    closeSessionExpiredModal,
} = authSlice.actions;

export default authSlice.reducer;
