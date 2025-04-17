import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import Razorpay from "razorpay";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv"

dotenv.config()

import crypto from "crypto";
import { RezorpayPayment } from "../modals/RezorpayPayment";
import { log } from "console";
import { Landlord } from "../modals/Landlord";


export const getAllPropertiesPayment = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const result = await RezorpayPayment.find().populate("landlord")
    res.status(200).json({ message: "Fetched batch success", result });
});



export const placePropertiesOrderPayment = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { amount } = req.body;
    const landlordId = req.landlord;

    if (!landlordId) {
        return res.status(400).json({ message: "Landlord ID not found in request" });
    }

    const fullLandlord = await Landlord.findById(landlordId);

    if (!fullLandlord) {
        return res.status(409).json({ message: "Landlord not found" });
    }

    const razorpaySecretKey = process.env.RAZORPAY_SECRET_KEY;
    const razorpayKeyId = process.env.RAZORPAY_API_KEY;

    if (!razorpaySecretKey || !razorpayKeyId) {
        return res.status(500).json({ message: "Razorpay credentials not found" });
    }

    const razorpay = new Razorpay({
        key_id: razorpayKeyId,
        key_secret: razorpaySecretKey
    });

    const receiptId = `rcptid_${Math.floor(Math.random() * 1000000)}`;
    const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: receiptId,
        payment_capture: 1
    };

    try {
        const order = await razorpay.orders.create(options);

        await RezorpayPayment.create({
            landlord: fullLandlord._id,
            name: fullLandlord.name,
            price: amount,
            orderId: order.id,
            status: "created",
            receipt: receiptId
        });

        return res.status(201).json({
            message: "Order created successfully",
            result: {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                key_id: razorpayKeyId
            }
        });
    } catch (error) {
        console.error("Razorpay order creation failed:", error);
        return res.status(500).json({ message: "Failed to create Razorpay order" });
    }
});



export const initiatePayment = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    console.log("Received from frontend:");
    console.log("razorpay_order_id:", razorpay_order_id);
    console.log("razorpay_payment_id:", razorpay_payment_id);
    console.log("razorpay_signature:", razorpay_signature);

    const razorpaySecretKey = process.env.RAZORPAY_SECRET_KEY as string;

    if (!razorpaySecretKey) {
        return res.status(500).json({ message: "Razorpay secret key not found" });
    }

    const generatedSignature = crypto
        .createHmac("sha256", razorpaySecretKey)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

    console.log("Generated Signature:", generatedSignature);

    if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({ message: "Payment signature verification failed" });
    }

    // Update payment record
    const payment = await RezorpayPayment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        {
            paymentId: razorpay_payment_id,
            status: "paid",
        },
        { new: true }
    );

    if (!payment) {
        return res.status(406).json({ message: "Payment record not found" });
    }

    // Update landlord payment status
    await Landlord.findByIdAndUpdate(payment.landlord, {
        isPaid: true,
        paidForExtraProperties: true,
    });

    res.status(200).json({
        message: "Payment verified and saved successfully",
        payment,
    });
});



export const verifyPayment = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { orderId, paymentId, signature } = req.body;

    const razorpaySecret = process.env.RAZORPAY_SECRET_KEY;

    if (!razorpaySecret) {
        return res.status(500).json({ message: "Razorpay secret key is not defined." });
    }

    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
        .createHmac("sha256", razorpaySecret)
        .update(body)
        .digest("hex");

    if (expectedSignature !== signature) {
        return res.status(400).json({ message: "Payment verification failed" });
    }

    const result = await RezorpayPayment.findOneAndUpdate(
        { orderId },
        { paymentId, status: "paid" },
        { new: true }
    );

    if (!result) {
        return res.status(409).json({ message: "Payment record not found" });
    }

    const landlord = await Landlord.findById(result.landlord);

    if (!landlord) {
        return res.status(406).json({ message: "Landlord not found" });
    }

    landlord.paidForExtraProperties = true;
    landlord.isPaid = true;
    await landlord.save();

    return res.status(200).json({
        message: "Payment verified and updated successfully",
        result,
    });
});

export const deleteRezorPayment = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const result = await RezorpayPayment.findByIdAndUpdate(
        req.params.id, { isDeleted: true }, { new: true })
    if (!result) {
        return res.status(409).json({ message: "Payment not found" });
    }
    res.json({ message: "Payment deleted successfully", result });
});
