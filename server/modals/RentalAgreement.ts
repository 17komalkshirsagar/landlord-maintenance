import mongoose, { Document, Schema } from "mongoose";

export interface IRentalAgreement extends Document {
    landlord: mongoose.Schema.Types.ObjectId;
    tenant: mongoose.Schema.Types.ObjectId;
    property: mongoose.Schema.Types.ObjectId;
    startDate: Date;
    endDate: Date;
    monthlyRent: number;
    contractRenewalDate: Date;
    status: "active" | "expired";
    isDeleted?: Boolean,
}

const rentalAgreementSchema = new Schema<IRentalAgreement>(
    {
        landlord: { type: mongoose.Schema.Types.ObjectId, ref: "Landlord", required: true },
        tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
        property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        monthlyRent: { type: Number, required: true },
        contractRenewalDate: { type: Date, required: true },
        status: { type: String, enum: ["active", "expired"], default: "active" },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export const RentalAgreement = mongoose.model<IRentalAgreement>("RentalAgreement", rentalAgreementSchema);
