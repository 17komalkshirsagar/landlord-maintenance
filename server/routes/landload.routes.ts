import express from "express";
import * as landlordController from "../controllers/Landlord.controller";

const landlordRouter = express.Router();

landlordRouter
    .get("/landlord/dashboard", landlordController.getLandlordDashboardData)

    .get("/get-all-leases", landlordController.getAllLeases)
    .get("/get-lease/:id", landlordController.getLeaseById)
    .put("/update-lease/:id", landlordController.updateLease)
    .put("/terminate-lease/:id", landlordController.terminateLease)
    .post("/create-lease", landlordController.createLease)
    .delete("/delete-lease/:id", landlordController.deleteLease)
    .get("/lease/:tenant", landlordController.viewLeaseDetails)


    .post("/create-all-bills-tax", landlordController.createTax)
    .get("/get-all-tax", landlordController.getAllTaxes)
    .get("/taxes-by-property/:id", landlordController.getTaxesByPropertyId)
    .put("/update-tax/:id", landlordController.updateTaxPaymentStatus)
    .delete("/delete-tax/:id", landlordController.deleteTax)



    .get("/view-notifications/:tenant", landlordController.viewNotifications)

    .post("/create/notification", landlordController.createNotification)
    .get("/all/notification", landlordController.getAllNotifications)
    .post("/send-tenant-notification", landlordController.sendTenantNotification)
    .post("/schedule-email", landlordController.scheduleEmailNotifications)
    .get("/user-notification/:userId", landlordController.getNotificationsByUser)
    .put("/mark-as-seen/:id", landlordController.markAsSeen)
    .delete("/delete-notification/:id", landlordController.deleteNotification)

    .post("/create/tenant/history", landlordController.createTenantHistory)
    .get("/all/tenant/history", landlordController.getAllTenantHistory)
    .get("/property/:id", landlordController.getTenantHistoryByPropertyId)
    .delete("/delete/tenant/history/:id", landlordController.deleteTenantHistory)
    .delete("/update/history/:id", landlordController.updateTenantHistory)

    .get("/history/view", landlordController.viewTenantHistory)
    .post("/create/rental-agreement", landlordController.createRentalAgreement)
    .get("/all/rental/agreement", landlordController.getAllRentalAgreements)
    .get("/get-tenant-rental-agreement/:id", landlordController.getRentalAgreementById)
    .put("/update-rental-agreement/:id", landlordController.updateRentalAgreementStatus)
    .delete("/delete-rental-agreement/:id", landlordController.deleteRentalAgreement)
    .delete("/terminate-rental-agreement/:agreementId", landlordController.terminateRentalAgreement)
    .post("/apply", landlordController.applyForRental)
    .post("/sign", landlordController.signRentalAgreement)

    .post("/create/maintance", landlordController.createMaintenanceRequest)
    .get("/get-all/maintenance", landlordController.getAllMaintenanceRequests)
    .get("/get-maintance/:id", landlordController.getMaintenanceRequestById)
    .put("/update-maintance/:id", landlordController.updateMaintenanceRequest)
    .put("/complete-maintance/:id", landlordController.completeMaintenanceRequest)
    .delete("/delete-maintance/:id", landlordController.deleteMaintenanceRequest)
    .put("/approve-maintance/:id", landlordController.approveMaintenanceRequest)
    .post("/maintenance", landlordController.requestMaintenance)


    .get("/get-all-property", landlordController.getAllProperties)
    .get("/get-property/:id", landlordController.getPropertyById)
    .post("/create-property", landlordController.createProperty)
    .put("/update-property/:id", landlordController.updateProperty)
    .delete("/delete-property/:id", landlordController.deleteProperty)

    .get("/browse", landlordController.browseProperties)



    .post("/create-new", landlordController.createTenant)
    .get("/all-tenant", landlordController.getAllTenants)
    .get("/all-tenant/:id", landlordController.getTenantById)
    .put("/update-tenant/:id", landlordController.updateTenant)
    .delete("/delete-tenant/:id", landlordController.deleteTenant)
    .put("/approve/:id", landlordController.approveTenant)



    .get("/get-all-bills/", landlordController.getAllBills)
    .get("/get-bill/:id", landlordController.getBillbyId)
    .put("/update-bill/:id", landlordController.updateBill)
    .post("/createbill", landlordController.createBill)
    .delete("/delete-bill/:id", landlordController.deleteBill)
    .put("/mark-paid/:id", landlordController.markBillAsPaid)
    .post("/utility-bills/pay", landlordController.payUtilityBills)


    .post("/create/payment", landlordController.createPayment)
    .get("/all/payment", landlordController.getAllPayments)
    .get("/tenant-payment/:id", landlordController.getPaymentsByTenant)
    .put("/update-payment-status/:paymentId", landlordController.updatePaymentStatus)
    .delete("/delete-payment/:id", landlordController.deletePayment)



    .get("/get-all-contracts", landlordController.getAllContracts)
    .get("/get-contract/:id", landlordController.getContractById)
    .post("/create-contract", landlordController.createContract)
    .put("/update-contract/:id", landlordController.updateContract)
    .delete("/delete-contract/:id", landlordController.deleteContract)
export default landlordRouter;
