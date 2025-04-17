import { NextFunction, Request, Response } from "express";
import passport from "../services/passport";
import dotenv from "dotenv";

dotenv.config();

export interface IAdmin {
    _id: string;
    admin?: any;
    email: string;
    mobile: string;
    isAdmin?: boolean;
    isBlock?: boolean;
}

export interface ILandlord {
    _id: string;
    landlord?: ILandlord;
    name: string;
    email: string;
    mobile: string;
    image: string;
    lastLogin?: Date;
    otpExpire?: Date;
    isDeleted?: boolean;
    isBlock?: boolean;
    otp?: string;
    status?: "active" | "inactive";
}



declare module "express-serve-static-core" {
    interface Request {
        admin?: IAdmin;
        landlord?: ILandlord;


    }
}



export const protectAdmin = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("jwt", { session: false }, (err: Error, admin: any, info: any) => {
        if (err) {
            return res.status(500).json({ message: "Internal Server Error", error: err.message });
        }
        if (!admin) {
            return res.status(401).json({ message: "Unauthorized: Invalid or missing token" });
        }
        if (!admin.isAdmin) {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }
        req.admin = admin;
        next();
    })(req, res, next);
};


export const protectLandlord = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("jwt", { session: false }, (err: Error, landlord: ILandlord, info: any) => {
        if (err) {
            return res.status(500).json({ message: "Internal Server Error", error: err.message });
        }
        if (!landlord) {
            return res.status(401).json({ message: "Unauthorized: Invalid or missing token" });
        }
        if (landlord.isBlock) {
            return res.status(403).json({ message: "Your account is blocked, please contact support." });
        }

        req.landlord = landlord.landlord;
        next();
    })(req, res, next)
};
