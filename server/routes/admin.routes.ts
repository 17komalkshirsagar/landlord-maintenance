
import express from "express";
import * as adminController from "../controllers/admin.controller";
const adminRouter = express.Router();
adminRouter
    // .post("/register", adminController.registerAdmin)
    // .post("/login", adminController.signIn)
    // .post("/verify-otp", adminController.verifyOTP)
    // .post("/logout", adminController.logoutAdmin)

    .get("/rental-agreements", adminController.viewRentalAgreements)


    .put("/landlord/approve/:id", adminController.approveLandlord)
    .put("/landlord/block/:id", adminController.blockLandlord)
    .put("/tenant/block/:tenantId", adminController.blockTenant)
    .get("/properties", adminController.getAllProperties)
    .get("/landlord/get", adminController.getAllLandlord)
    .get("/payments", adminController.monitorPayments)
    .get("/taxes", adminController.reviewTaxes)
    .get("/utility-bills", adminController.reviewUtilityBills)
    .post("/notifications", adminController.sendNotification)
    .put("/contracts/approve/:contractId", adminController.approveContract)


    .get("/dashboard", adminController.getAdminDashboardData);
export default adminRouter;