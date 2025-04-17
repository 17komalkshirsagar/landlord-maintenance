import mongoose, { Model, Schema } from "mongoose";

export interface INotification extends Document {
    tenant: mongoose.Schema.Types.ObjectId;
    landlord: mongoose.Schema.Types.ObjectId;
    message: string;
    seen: boolean;
    isDeleted?: Boolean,
    type: String,

}

const notificationSchema = new Schema<INotification>({
    landlord: { type: mongoose.Schema.Types.ObjectId, ref: "Landlord", required: true },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: false },
    message: { type: String, required: true },
    seen: { type: Boolean, default: false },
    type: {
        type: String,
        enum: [
            "Your rent payment is due soon",
            "Other"
        ],

    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

export const Notification = mongoose.model<INotification>("Notification", notificationSchema);