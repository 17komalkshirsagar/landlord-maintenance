import mongoose, { Model, Schema } from "mongoose";

export interface IContract extends Document {
    property: mongoose.Schema.Types.ObjectId;
    tenant: mongoose.Schema.Types.ObjectId;
    landlord: mongoose.Schema.Types.ObjectId;
    startDate: Date;
    expiryDate: Date;
    isDeleted?: Boolean,
    status: "pending" | "approved" | "rejected";
}

const contractSchema = new Schema<IContract>({
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    landlord: { type: mongoose.Schema.Types.ObjectId, ref: "Landlord", required: true },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
    startDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },

    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

export const Contract = mongoose.model<IContract>("Contract", contractSchema)