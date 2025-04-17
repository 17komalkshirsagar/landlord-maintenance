import express from "express";
import * as authController from "../controllers/Auth.controller";
import { upload } from "../utils/uploadd";
const authRouter = express.Router();
authRouter

    .post("/register", authController.registerAdmin)
    .post("/login", authController.signIn)
    .post("/verify-otp", authController.verifyOTP)
    .post("/logout", authController.logoutAdmin)


    .post("/register/landlord", authController.registerLandlord)
    .post("/login/landlord", authController.loginLandlord)
    .post("/verify-otp/landlord", authController.verifyLandlordOTP)
    .post("/logout/landlord", authController.logoutLandlord)
    .post("/continue-with-google", authController.continueWithGoogle);

export default authRouter