import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdmin extends Document {
    name: string;
    email: string;
    otp?: number;
    role?: string;
    otpExpire?: Date;
    mobile: number;
}

const adminSchema: Schema = new Schema(
    {
        name: { type: String, },
        role: { type: String, default: "admin" },
        email: { type: String, unique: true, required: true },
        otp: { type: Number },
        otpExpire: { type: Date, },
        mobile: { type: Number, required: true },
    },
    { timestamps: true }
);


export const Admin = mongoose.model<IAdmin>("Admin", adminSchema);

