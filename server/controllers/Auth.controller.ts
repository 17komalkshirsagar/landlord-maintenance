import { Admin, IAdmin } from "../modals/Admin"
import { NextFunction, Request, Response } from "express"
import asyncHandler from "express-async-handler"
import { generateResetToken, generateToken } from "../utils/generateToken"
import { customValidator, validationRulesSchema } from "../utils/validator"
import { sendEmail } from "../utils/email";
import dotenv from "dotenv";
import { registerRules, signInRules, verifyOTPRules } from "../rules/auth.rules"
import { ILandlord, Landlord } from "../modals/Landlord"

import cloudinary from "../utils/uploadConfig"
import { upload } from "../utils/uploadd"
import { OAuth2Client } from "google-auth-library";

dotenv.config();

export const registerAdmin = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { name, email, mobile } = req.body
    const { isError, error } = customValidator({ name, email, mobile }, registerRules)
    if (isError) {
        return res.status(400).json({ message: "All Feilds Required", error })
    }
    if (!email) {
        return res.status(400).json({ message: "Invalid Email" })
    }
    const isFound = await Admin.findOne({ email })
    if (isFound) {
        return res.status(400).json({ message: "email already registered with us" })
    }
    await Admin.create({ name, email, mobile })

    res.json({ message: "Register Success" })
})
export const signIn = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { email, mobile }: IAdmin = req.body;

    const { isError, error } = customValidator(req.body, signInRules);
    if (isError) {
        return res.status(422).json({ message: "validation errors", error });
    }

    const admin = await Admin.findOne({ $or: [{ email }, { mobile }] });
    if (!admin) {
        return res.status(401).json({ message: "invalid email or mobile not found" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);

    await Admin.findByIdAndUpdate(admin._id, {
        otp,
        otpExpire: new Date(Date.now() + 1000 * 60 * 3)
    });
    const token = generateToken({ admin: admin._id });

    res.status(200).json({
        message: "OTP sent successfully.OTP expires in 3 minutess",
        result: {
            _id: admin._id,
            name: admin.name,
            mobile: `${admin.mobile}`,
            email: admin.email,
            token
        }
    });
});
export const verifyOTP = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { otp, mobile, email }: IAdmin = req.body;
    const { isError, error } = customValidator(req.body, verifyOTPRules);
    if (isError) {
        return res.status(422).json({ message: "validation errors", error });
    }
    if (!mobile && !email) {
        return res.status(422).json({ message: "Validation error: Please provide either email or mobile number" });
    }
    const result = await Admin.findOne({ $or: [{ mobile }, { email }] });
    if (!result) {
        return res.status(400).json({ message: "Invalid OTP or expired" });
    }
    if (result.otpExpire && new Date() > result.otpExpire) {
        return res.status(400).json({ message: "OTP expired" });
    }
    if (result.otp != otp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }
    await Admin.findByIdAndUpdate(result._id, { otp: null, otpExpire: null });
    const token = generateToken({ admin: result._id });
    res.status(200).json({
        message: "OTP verified successfully",
        result: {
            _id: result._id,
            name: result.name,
            mobile: `${result.mobile}`,
            email: result.email,
            token
        }
    });
});
export const logoutAdmin = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    // res.clearCookie("jwt")
    // res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "strict" });

    res.json({ message: "Admin Logout Success" })
})


export const registerLandlord = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { name, email, mobile } = req.body;
    const { isError, error } = customValidator({ name, email, mobile }, registerRules);
    if (isError) {
        return res.status(422).json({ message: "validation errors", error });
    }
    const landlordExists = await Landlord.findOne({ email });
    if (landlordExists) {
        return res.status(400).json({ message: "Landlord already registered" });
    }
    const landlord = await Landlord.create({ name, email, mobile });
    if (landlord) {
        try {
            await sendEmail({
                to: email,
                subject: "Registration Successful",
                text: `Welcome, ${name}! Your registration is successful.`
            });
        } catch (error) {
            console.error("Email sending failed:", error);
        }

        const token = await generateToken({ landlord: landlord._id });

        const result = {
            _id: landlord._id,
            name: landlord.name,
            email: landlord.email,
            mobile: `${landlord.mobile}`,
            token,
        };

        return res.status(200).json({ message: "Logged in successfully", result });
    }

    return res.status(400).json({ message: "Invalid landlord data" });
});
export const loginLandlord = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { email, mobile }: ILandlord = req.body;

    const { isError, error } = customValidator(req.body, signInRules);
    if (isError) {
        return res.status(422).json({ message: "validation errors", error });
    }

    const landlord = await Landlord.findOne({ $or: [{ email }, { mobile }] });
    if (!landlord) {
        return res.status(401).json({ message: "invalid email or mobile not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    await Landlord.findByIdAndUpdate(landlord._id, {
        otp,
        otpExpire: new Date(Date.now() + 1000 * 60 * 3)
    });

    const token = generateToken({ landlord: landlord._id });

    res.status(200).json({
        message: "OTP sent successfully. OTP expires in 3 minutes",
        result: {
            _id: landlord._id,
            name: landlord.name,
            mobile: `${landlord.mobile}`,
            email: landlord.email,
            token
        }
    });
});
export const verifyLandlordOTP = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { otp, mobile }: ILandlord = req.body;
    const { isError, error } = customValidator(req.body, verifyOTPRules);
    if (isError) {
        return res.status(422).json({ message: "Validation errors", error });
    }
    if (!mobile) {
        return res.status(422).json({ message: "Validation error: Please provide a mobile number" });
    }
    const result = await Landlord.findOne({ mobile });
    if (!result) {
        return res.status(400).json({ message: "Invalid OTP or expired (landlord not found)" });
    }
    if (result.otpExpire && new Date() > new Date(result.otpExpire)) {
        return res.status(400).json({ message: "OTP expired" });
    }
    if (result.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }
    await Landlord.findByIdAndUpdate(result._id, { otp: null, otpExpire: null });

    const token = generateToken({ landlord: result._id });

    res.status(200).json({
        message: "OTP verified successfully",
        result: {
            _id: result._id,
            name: result.name,
            mobile: result.mobile,
            email: result.email,
            token
        }
    });
});
export const logoutLandlord = asyncHandler(async (req: Request, res: Response): Promise<any> => {

    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "strict" });

    res.json({ message: "Landlord Logout Success" })
})








export const continueWithGoogle = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const { credential, email, name, image, mobile } = req.body;

    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
        return res.status(400).json({ message: "Invalid Google token" });
    }

    let result = await Landlord.findOne({ email });

    if (!result) {
        result = await Landlord.create({ name, email, mobile, image, })
    }

    result.lastLogin = new Date(); await result.save();

    if (payload?.email) {
        const emailData = {
            to: payload.email,
            subject: "Register Success",
            text: "Thank you for signing in with Google",
            html: `<h1>Welcome to Management</h1><p>Thank you for signing in with Google</p>`,
        };

        try {
            await sendEmail(emailData);
        } catch (error) {
            console.error("Error sending email: ", error);
        }
    } else {
        console.error("Email is missing in payload");
    }
    const token = generateToken({ landlord: result._id });

    res.status(200).json({ message: "Login successful", result: { ...result, token }, })
});































































