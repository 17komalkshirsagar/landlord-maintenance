import { NextFunction, Request, Response } from "express"
import asyncHandler from "express-async-handler"
import bcryptjs from "bcryptjs"
import jwt, { JwtPayload } from "jsonwebtoken"
import crypto from "crypto"
import { sendEmail } from "../utils/email"
import { customValidator, validationRulesSchema } from "../utils/validator"
import { registerRules, sendOTPRules, signInRules, verifyOTPRules } from "../rules/auth.rules"
import { generateResetToken, generateToken } from "../utils/generateToken"
// import { otpVerificationTemplate } from "../templates/otpVerificationTemplate"
import { resetPasswordTemplate } from "../templates/resetPasswordTemplate"
import { Contract } from "../modals/Contract";

import dotenv from "dotenv";
import { Admin, IAdmin } from "../modals/Admin"
import { Landlord } from "../modals/Landlord"
import { Property } from "../modals/Property"
import { Payment } from "../modals/Payment"
import { Tenant } from "../modals/Tenant"
import { Tax } from "../modals/Tax"
import { UtilityBill } from "../modals/UtilityBill"
import { Notification } from "../modals/Notification"


    ;
import { RentalAgreement } from "../modals/RentalAgreement"
import { MaintenanceRequest } from "../modals/Maintenance"
import { TenantHistory } from "../modals/TenantHistory"
import { Lease } from "../modals/Lease"

dotenv.config({})






export const approveLandlord = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const result = await Landlord.findByIdAndUpdate(req.params.id, { status: "active" }, { new: true });
    if (!result) {
        return res.status(404).json({ message: "Landlord not found" });
    }
    res.status(200).json({ message: "landlord aprrobe successfully", result });

});
export const blockLandlord = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const result = await Landlord.findByIdAndUpdate(req.params.id, { isBlock: true }, { new: true });

    if (!result) {
        return res.status(406).json({ message: "Landlord not found" });
    }

    res.json({ message: "Landlord blocked successfully", result });
});
export const blockTenant = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { tenantId } = req.params;
    const tenant = await Tenant.findByIdAndUpdate(tenantId, { status: "blocked" }, { new: true });
    if (!tenant) return res.status(406).json({ message: "Tenant not found" });
    res.json({ message: "Tenant blocked successfully", tenant });
});




export const getAllLandlord = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { search = "", page = "1", limit = "10" } = req.query as {
        search?: string;
        page?: string;
        limit?: string;
    };

    const currentPage = parseInt(page, 10) || 1;
    const currentLimit = parseInt(limit, 10) || 10;
    const skip = (currentPage - 1) * currentLimit;

    const query = search
        ? {
            $or: [
                { name: { $regex: search, $options: "i" } },
                { contact: { $regex: search, $options: "i" } },
            ],
        }
        : {};

    const totalLandlord = await Landlord.countDocuments(query);

    const result = await Landlord.find(query)
        .skip(skip)
        .limit(currentLimit)
        .sort({ createdAt: -1 });

    res.status(200).json({
        message: "Landlords fetched successfully",
        result,
        pagination: {
            total: totalLandlord,
            page: currentPage,
            limit: currentLimit,
            totalPages: Math.ceil(totalLandlord / currentLimit),
        },
    });
});





export const getAllProperties = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const result = await Property.find()
    return res.status(200).json({ message: 'get All Properties  all get successfully', result });
});
export const monitorPayments = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const result = await Payment.find()
    return res.status(200).json({ message: 'Payment  all get successfully', result });
});


// Review taxes
export const reviewTaxes = asyncHandler(async (req: Request, res: Response) => {
    const result = await Tax.find();
    res.json({ message: "All tax records retrieved", result });
});
export const reviewUtilityBills = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const result = await UtilityBill.find();
    res.json({ message: "All pending utility bills retrieved", result });
});
export const sendNotification = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { message, user } = req.body;
    const result = await Notification.create({ message, user });
    res.json({ message: "Notification sent successfully", result });
});

// Approve legal contracts
export const approveContract = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { contractId } = req.params;
    const result = await Contract.findByIdAndUpdate(contractId, { status: "approved" }, { new: true });
    if (!result) return res.status(406).json({ message: "Contract not found" });
    res.json({ message: "Contract approved successfully", result });
});


export const viewRentalAgreements = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const result = await Contract.find();
    res.json({ message: "All rental agreements retrieved", result });
});



export const getAdminDashboardData = asyncHandler(async (req: Request, res: Response) => {
    const [
        totalLandlords,
        totalTenants,
        totalProperties,
        totalLeases,
        totalContracts,
        totalTenantHistory,
        totalMaintenance,
        totalTax,
        totalBills,
        totalPayments,
        totalAgreements
    ] = await Promise.all([
        Landlord.countDocuments({ isDeleted: false }),
        Tenant.countDocuments({ isDeleted: false }),
        Property.countDocuments({ isDeleted: false }),
        Lease.countDocuments({ isDeleted: false }),
        Contract.countDocuments({ isDeleted: false }),
        TenantHistory.countDocuments({ isDeleted: false }),
        MaintenanceRequest.countDocuments({ isDeleted: false }),
        Tax.countDocuments({ isDeleted: false }),
        UtilityBill.countDocuments({ isDeleted: false }),
        Payment.countDocuments({ isDeleted: false }),
        RentalAgreement.countDocuments({ isDeleted: false }),
    ]);

    const recentPayments = await Payment.find({ isDeleted: false })
        .populate("tenant property")
        .sort({ createdAt: -1 })


    const recentTenants = await Tenant.find({ isDeleted: false })
        .populate("property")
        .sort({ createdAt: -1 })


    const recentMaintenance = await MaintenanceRequest.find({ isDeleted: false })
        .populate("property")
        .sort({ createdAt: -1 })

    const recentProperties = await Property.find({ isDeleted: false })
        .populate("landlord")
        .sort({ createdAt: -1 })


    res.status(200).json({
        message: "Admin dashboard data retrieved successfully",
        data: {
            totals: {
                landlords: totalLandlords,
                tenants: totalTenants,
                properties: totalProperties,
                leases: totalLeases,
                contracts: totalContracts,
                tenantHistory: totalTenantHistory,
                maintenance: totalMaintenance,
                tax: totalTax,
                bills: totalBills,
                payments: totalPayments,
                agreements: totalAgreements,
            },
            recent: {
                payments: recentPayments,
                tenants: recentTenants,
                maintenance: recentMaintenance,
                properties: recentProperties,
            }
        }
    });
});
