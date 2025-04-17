import mongoose, { Model, Schema } from "mongoose";
export interface IProperty extends Document {
    landlord: mongoose.Schema.Types.ObjectId;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    type: "residential" | "commercial";
    rentAmount: number
    status: "available" | "rented";
    isDeleted?: Boolean,
}

const propertySchema = new Schema<IProperty>(
    {
        landlord: { type: mongoose.Schema.Types.ObjectId, ref: "Landlord", required: true },
        name: { type: String, required: true, trim: true },
        address: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        zipCode: { type: String, required: true, trim: true },
        rentAmount: { type: Number, required: true },
        type: { type: String, enum: ["residential", "commercial"], required: true },
        status: { type: String, enum: ["available", "rented"], default: "available" },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export const Property = mongoose.model<IProperty>("Property", propertySchema);
