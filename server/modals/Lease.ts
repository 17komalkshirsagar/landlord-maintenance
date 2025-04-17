import mongoose, { Schema } from "mongoose";

export interface ILease extends Document {
    tenant: mongoose.Schema.Types.ObjectId;
    property: mongoose.Schema.Types.ObjectId;
    landlord: mongoose.Schema.Types.ObjectId;
    startDate: Date;
    endDate: Date;
    rentAmount: string;
    securityDeposit: string;
    terms: string;
    status: "active" | "terminated";
    isDeleted: {
        type: Boolean,
        default: false,
    },
}

const leaseSchema = new Schema<ILease>(
    {
        tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
        property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
        landlord: { type: mongoose.Schema.Types.ObjectId, ref: "Landlord", required: true },

        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        rentAmount: { type: String, required: true },
        securityDeposit: { type: String, required: true },
        terms: { type: String, required: true },
        status: { type: String, enum: ["active", "terminated"], default: "active" },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export const Lease = mongoose.model<ILease>("Lease", leaseSchema);
