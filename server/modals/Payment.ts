import mongoose, { Model, Schema } from "mongoose";
export interface IPayment extends Document {
    tenant: mongoose.Schema.Types.ObjectId;
    property: mongoose.Schema.Types.ObjectId;
    landlord: mongoose.Schema.Types.ObjectId;
    amount: number;
    date: Date;
    paymentMethod: "creditCard" | "debitCard" | "bankTransfer" | "cash";
    status: "pending" | "completed" | "failed";
    paymentType: "rent" | "tax" | "utility";
    paymentDate: Date;
    isDeleted?: Boolean,
}

const paymentSchema = new Schema<IPayment>(
    {
        tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
        landlord: { type: mongoose.Schema.Types.ObjectId, ref: "Landlord", required: true },

        property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
        amount: { type: Number, required: true },
        paymentType: { type: String, enum: ["rent", "tax", "utility"], required: true },
        paymentDate: { type: Date, required: true },
        date: { type: Date, },
        paymentMethod: {
            type: String,
            enum: ["creditCard", "debitCard", "bankTransfer", "cash"],
            required: true
        },
        status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
