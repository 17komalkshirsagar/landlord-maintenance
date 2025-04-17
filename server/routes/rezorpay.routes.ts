import express from "express";
import * as rezorpayController from "../controllers/rezorpaypayment.controller";

const rezorpayRouter = express.Router();


rezorpayRouter
    .get('/rezorpay/payments', rezorpayController.getAllPropertiesPayment)
    .post('/rezorpay/create-order', rezorpayController.placePropertiesOrderPayment)
    .post('/rezorpay/payment-success', rezorpayController.initiatePayment)
    .post('/rezorpay/verify-payment', rezorpayController.verifyPayment)
    .delete("/payment/:id", rezorpayController.deleteRezorPayment)
export default rezorpayRouter;
