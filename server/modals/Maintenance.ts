import mongoose, { Model, Schema } from "mongoose";

export interface IMaintenanceRequest extends Document {
    tenant: mongoose.Schema.Types.ObjectId;
    property: mongoose.Schema.Types.ObjectId;
    landlord: mongoose.Schema.Types.ObjectId;
    description: string;
    status: "pending" | "inProgress" | "completed";
    isDeleted?: Boolean,

}

const maintenanceSchema = new Schema<IMaintenanceRequest>(
    {
        tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
        property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
        landlord: { type: mongoose.Schema.Types.ObjectId, ref: "Landlord", required: true },

        description: { type: String, required: true },
        status: { type: String, enum: ["pending", "inProgress", "completed"], default: "pending" },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export const MaintenanceRequest = mongoose.model<IMaintenanceRequest>("MaintenanceRequest", maintenanceSchema);
