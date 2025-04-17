import mongoose, { Model, Schema } from "mongoose";

export interface IUtilityBill extends Document {
    property: mongoose.Schema.Types.ObjectId;
    landlord: mongoose.Schema.Types.ObjectId;
    billType: "electricity" | "water" | "gas";
    amount: number;
    dueDate: Date;
    paid: boolean;
    isDeleted?: Boolean,
}

const utilityBillSchema = new Schema<IUtilityBill>({
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    landlord: { type: mongoose.Schema.Types.ObjectId, ref: "Landlord", required: true },
    billType: { type: String, enum: ["electricity", "water", "gas"], required: true },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    paid: { type: Boolean, default: false },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

export const UtilityBill = mongoose.model<IUtilityBill>("UtilityBill", utilityBillSchema);