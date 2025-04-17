import mongoose, { Schema, Document } from "mongoose";

export interface IRezorpayPayment extends Document {
    landlord: mongoose.Types.ObjectId;
    price: number;
    orderId: string;
    name: string;
    paymentId?: string;
    status: "created" | "paid" | "failed";
    receipt: string;
}

const RezorpayPaymentSchema: Schema = new Schema(
    {
        landlord: { type: mongoose.Schema.Types.ObjectId, ref: "Landlord", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        orderId: { type: String, required: true },
        paymentId: { type: String },
        status: { type: String, enum: ["created", "paid", "failed"], default: "created" },
        receipt: { type: String },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export const RezorpayPayment = mongoose.model<IRezorpayPayment>("RezorpayPayment", RezorpayPaymentSchema);
