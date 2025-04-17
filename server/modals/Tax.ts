import mongoose, { Model, Schema } from "mongoose";
export interface ITax extends Document {
    property: mongoose.Schema.Types.ObjectId;
    landlord: mongoose.Schema.Types.ObjectId;
    taxType: "property tax" | "building tax" | "holding tax" | "tower tax";
    taxAmount: number;
    dueDate: Date;
    paid: boolean;
    isDeleted?: Boolean,
}

const taxSchema = new Schema<ITax>({
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    landlord: { type: mongoose.Schema.Types.ObjectId, ref: "Landlord", required: true },

    taxType: { type: String, enum: ["property tax", "building tax", "holding tax", "tower tax"], required: true },
    taxAmount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    paid: { type: Boolean, default: false },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

export const Tax = mongoose.model<ITax>("Tax", taxSchema);