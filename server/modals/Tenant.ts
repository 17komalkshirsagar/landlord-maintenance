import mongoose, { Model, Schema } from "mongoose";
export interface ITenant extends Document {
    tenant: mongoose.Schema.Types.ObjectId;
    property: mongoose.Schema.Types.ObjectId;
    landlord: mongoose.Schema.Types.ObjectId;
    email: string;
    name: string;
    mobile: string;
    leaseStart: Date;
    leaseEnd: Date;
    rentAmount: string;
    image: string;
    documents: string[];
    securityDeposit: string;
    status: "pending" | "approved" | "rejected";
    isDeleted?: Boolean,
}

const tenantSchema = new Schema<ITenant>(
    {
        landlord: { type: mongoose.Schema.Types.ObjectId, ref: "Landlord", required: true },

        property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
        name: { type: String, required: true },
        mobile: { type: String, required: true },
        leaseStart: { type: Date, required: true },
        leaseEnd: { type: Date, required: true },
        rentAmount: { type: String, required: true },
        email: { type: String },
        image: { type: String, required: true, default: "dummy.jpg" },
        documents: [{ type: String }],
        securityDeposit: { type: String, required: true },
        status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export const Tenant = mongoose.model<ITenant>("Tenant", tenantSchema);
