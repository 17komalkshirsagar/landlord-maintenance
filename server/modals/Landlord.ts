import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILandlord extends Document {
    name: string;
    mobile: number;
    propertyCount: number;
    otp?: string;
    role?: string;
    email: string;
    image: string;
    isBlock?: boolean;
    isPaid?: Boolean,
    lastLogin?: Date;
    otpExpire?: Date;
    isDeleted?: boolean;
    status?: "active" | "inactive";
    paidForExtraProperties?: boolean;
    token?: string;
}


const LandlordSchema: Schema = new Schema(
    {
        name: { type: String, },
        mobile: { type: Number, },
        otp: { type: String },
        role: { type: String, default: "landlord" },

        email: { type: String, unique: true },
        image: {
            type: String,
            required: true,
            default: "https://static.vecteezy.com/system/resources/previews/027/990/875/non_2x/royal-frame-logo-generative-ai-free-png.png",
        },
        isBlock: { type: Boolean, default: false },
        lastLogin: { type: Date },
        isDeleted: { type: Boolean, default: false },
        otpExpire: { type: Date },
        status: { type: String, default: "active", enum: ["active", "inactive"] },
        propertyCount: { type: Number, default: 0 },
        isPaid: { type: Boolean, default: false },
        paidForExtraProperties: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);





export const Landlord = mongoose.model<ILandlord>("Landlord", LandlordSchema)

