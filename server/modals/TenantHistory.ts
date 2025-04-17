import mongoose, { Model, Schema } from "mongoose";
export interface ITenantHistory extends Document {
    property: mongoose.Schema.Types.ObjectId;
    tenant: mongoose.Schema.Types.ObjectId;
    landlord: mongoose.Schema.Types.ObjectId;
    startDate: Date;
    endDate?: Date;
    isDeleted?: Boolean,
}

const tenantHistorySchema = new Schema<ITenantHistory>({
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
    landlord: { type: mongoose.Schema.Types.ObjectId, ref: "Landlord", required: true },

    startDate: { type: Date, required: true },
    endDate: { type: Date },

    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

export const TenantHistory = mongoose.model<ITenantHistory>("TenantHistory", tenantHistorySchema);