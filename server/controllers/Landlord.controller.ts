import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/email";
import { customValidator } from "../utils/validator";
import { registerRules, sendOTPRules, signInRules, verifyOTPRules } from "../rules/auth.rules";
import { generateToken } from "../utils/generateToken";
import dotenv from "dotenv";
import { ILandlord, Landlord } from "../modals/Landlord";
import { RentalAgreement } from "../modals/RentalAgreement";
import { validationRulesSchema } from "../utils/validator";
import { Property } from "../modals/Property";
import { TenantHistory } from "../modals/TenantHistory";
import { Notification } from "../modals/Notification";
import { Tax } from "../modals/Tax";
import { Lease } from "../modals/Lease";
import { MaintenanceRequest } from "../modals/Maintenance";
import { Tenant } from "../modals/Tenant";
import { UtilityBill } from "../modals/UtilityBill";
import cloudinary from "../utils/uploadConfig";
import { upload } from "../utils/uploadd";

import { CronJob } from "cron";
import { Payment } from "../modals/Payment";
import { Contract } from "../modals/Contract";
dotenv.config();









export const createProperty = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const landlord = req.landlord;
    console.log("landlord", landlord);

    const { name, address, city, state, zipCode, type, rentAmount, status, } = req.body;

    const rules: validationRulesSchema = {
        landlord: { required: true },
        name: { required: true },
        address: { required: true },
        city: { required: true },
        state: { required: true },
        zipCode: { required: true },
        type: { required: true, enum: ["residential", "commercial"] },
        rentAmount: { required: true, type: "number" },
        status: { required: true, enum: ["available", "rented"] },
    };

    const { isError, error } = customValidator(
        { landlord, name, address, city, state, zipCode, type, rentAmount, status },
        rules
    );

    if (isError) {
        return res.status(400).json({ message: "Validation error", error });
    }

    const existingProperties = await Property.find({ landlord, isDeleted: false });


    if (existingProperties.length >= 5) {
        const landlordData = await Landlord.findById(landlord);

        if (!landlordData?.paidForExtraProperties) {
            return res.status(403).json({
                message: "You have reached the free limit of 5 properties. Please make a payment to add more.",
            });
        }
    }

    const result = await Property.create({
        landlord,
        name,
        address,
        city,
        state,
        zipCode,
        type,
        rentAmount,
        status,
    });

    res.status(201).json({ message: "Property created successfully", result });
});



export const getPropertyById = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    const rules: validationRulesSchema = { id: { required: true, type: "string" } };
    const { isError, error } = customValidator({ id }, rules);
    if (isError) return res.status(400).json({ message: "Validation error", error });

    const result = await Property.findOne({ _id: id }).populate("landlord");
    if (!result) return res.status(406).json({ message: "Property not found" });
    res.status(200).json({ message: "get property successfully", result });

});
export const updateProperty = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    const result = await Property.findByIdAndUpdate(id, req.body, { new: true });

    if (!result) return res.status(404).json({ message: "Property not found" });

    res.status(200).json({ message: "Property updated successfully", result });
});
export const deleteProperty = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    const rules: validationRulesSchema = { id: { required: true } };
    const { isError, error } = customValidator({ id }, rules);
    if (isError) return res.status(400).json({ message: "Validation error", error });

    const result = await Property.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

    if (!result) return res.status(409).json({ message: "Property not found" });

    res.status(200).json({ message: "Property marked as deleted successfully", result });
});


export const getAllProperties = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const landlord = req.landlord;
    const { search = "", page = "1", limit = "10" } = req.query;

    if (!landlord) {
        return res.status(401).json({ message: "landlord id is not founded" });
    }

    const currentPage = parseInt(page as string);
    const currentLimit = parseInt(limit as string);
    const skip = (currentPage - 1) * currentLimit;

    const filter: any = {
        landlord,
        isDeleted: false,
    };

    if (search) {
        filter.name = { $regex: search as string, $options: "i" };
    }

    const total = await Property.countDocuments(filter);
    const result = await Property.find(filter).populate("landlord").skip(skip).limit(currentLimit);

    res.status(200).json({
        success: true,
        message: "All properties fetched successfully",
        result,
        pagination: {
            total,
            page: currentPage,
            limit: currentLimit,
            totalPages: Math.ceil(total / currentLimit),
        },
    });
});

export const browseProperties = asyncHandler(async (req: Request, res: Response) => {
    const result = await Property.find({ status: "available" });
    res.status(201).json({ message: "borwser properties find", result });

});



export const approveTenant = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const result = await Tenant.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });

    if (!result) {
        return res.status(409).json({ message: "Tenant not found" });
    }

    res.json({ message: "Tenant approved", result });
});




export const createRentalAgreement = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const landlord = req.landlord;

    const rules: validationRulesSchema = {
        landlord: { required: true },
        tenant: { required: true, type: "string" },
        property: { required: true, type: "string" },
        startDate: { required: true, type: "date" },
        endDate: { required: true, type: "date" },
        monthlyRent: { required: true, type: "number" },
        contractRenewalDate: { required: true, type: "date" }
    };

    const { isError, error } = customValidator({ landlord, ...req.body }, rules);
    if (isError) return res.status(400).json({ message: "Validation error", error });

    const { tenant, property, startDate, endDate, monthlyRent, contractRenewalDate } = req.body;

    const result = await RentalAgreement.create({
        landlord,
        tenant,
        property,
        startDate,
        endDate,
        monthlyRent,
        contractRenewalDate
    });

    res.status(201).json({ message: "Rental agreement created successfully", result });
});




export const getAllRentalAgreements = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const landlord = req.landlord;
    const { page = "1", limit = "10", isFetchAll = "false", currentSearch = "" } = req.query;

    if (!landlord) {
        return res.status(401).json({ success: false, message: "Landlord ID not found" });
    }

    const currentPage = parseInt(page as string, 10);
    const currentLimit = parseInt(limit as string, 10);
    const skip = (currentPage - 1) * currentLimit;

    const filter: any = {
        isDeleted: false,
        landlord: landlord
    };

    if (currentSearch) {
        const tenantIds = await Tenant.find({
            name: { $regex: currentSearch, $options: "i" },
            landlord: landlord
        }).distinct("landlord");

        const propertyIds = await Property.find({
            name: { $regex: currentSearch, $options: "i" },
            landlord: landlord
        }).distinct("landlord");

        filter.$or = [
            { status: { $regex: currentSearch, $options: "i" } },
            { tenant: { $in: tenantIds } },
            { property: { $in: propertyIds } },
        ];
    }

    let agreements = [];
    let total = 0;

    if (isFetchAll === "true") {
        agreements = await RentalAgreement.find(filter)
            .populate("landlord")
            .populate("tenant")
            .populate("property");
        total = agreements.length;
    } else {
        total = await RentalAgreement.countDocuments(filter);
        agreements = await RentalAgreement.find(filter)
            .populate("landlord")
            .populate("tenant")
            .populate("property")
            .skip(skip)
            .limit(currentLimit);
    }

    return res.status(200).json({
        success: true,
        message: "Rental agreements fetched successfully",
        result: agreements,
        pagination: {
            total,
            page: currentPage,
            limit: currentLimit,
            totalPages: Math.ceil(total / currentLimit),
        },
    });
});

export const applyForRental = asyncHandler(async (req: Request, res: Response) => {
    const result = await RentalAgreement.create(req.body);
    res.status(201).json({ message: "Rental application submitted", result });
});
export const getRentalAgreementById = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    const rules: validationRulesSchema = { id: { required: true, type: "string" } };
    const { isError, error } = customValidator({ id }, rules);
    if (isError) return res.status(400).json({ message: "Validation error", error });

    const agreements = await RentalAgreement.findOne({ _id: id, isDeleted: false })
        .populate("landlord")
        .populate("property").populate("tenant")

    if (!agreements) {
        return res.status(406).json({ message: "Rental agreements not found" });
    }

    res.status(200).json({ message: "Rental agreements retrieved successfully", agreements });
});
export const signRentalAgreement = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { tenant, property, terms } = req.body;
    const result = await RentalAgreement.create({ tenant: tenant, property: property, terms });
    if (!result) {
        return res.status(406).json({ message: "Rental agreement signed not found" });
    }

    res.status(201).json({ message: "Rental agreement signed successfully", result });
});
export const updateRentalAgreementStatus = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { status } = req.body;

    const rules: validationRulesSchema = {
        id: { required: true, type: "string" },
        status: { required: true, type: "string", enum: ["active", "expired"] },
    };

    const { isError, error } = customValidator({ id, status }, rules);
    if (isError) return res.status(400).json({ message: "Validation error", error });

    const agreement = await RentalAgreement.findByIdAndUpdate(id, { status }, { new: true });

    if (!agreement) return res.status(404).json({ message: "Rental agreement not found" });

    res.status(200).json({ message: "Rental agreement status updated", agreement });
});
export const deleteRentalAgreement = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    const rules: validationRulesSchema = { id: { required: true, type: "string" } };
    const { isError, error } = customValidator({ id }, rules);
    if (isError) return res.status(400).json({ message: "Validation error", error });

    const agreement = await RentalAgreement.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

    if (!agreement) return res.status(406).json({ message: "Rental agreement not found" });

    res.status(200).json({ message: "Rental agreement marked as deleted", agreement });
});
export const terminateRentalAgreement = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { agreementId } = req.params;
    const result = await RentalAgreement.findByIdAndDelete(agreementId);

    if (!result) {
        return res.status(406).json({ message: "Rental agreement not found" });
    }

    res.json({ message: "Rental agreement terminated successfully", result });
});


export const createTenantHistory = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { property, tenant, startDate, endDate, landlord } = req.body;

    const rules: validationRulesSchema = {
        property: { required: true, type: "string" },
        tenant: { required: true, type: "string" },
        landlord: { required: true, type: "string" },
        startDate: { required: true, type: "date" },
        endDate: { type: "date" },
    };

    const { isError, error } = customValidator(req.body, rules);
    if (isError) return res.status(400).json({ message: "Validation error", error });

    const result = await TenantHistory.create({ property, tenant, startDate, endDate, landlord });

    res.status(201).json({ message: "Tenant history created successfully", result });
});

export const getAllTenantHistory = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { page, limit, isFetchAll = false, search }: any = req.query;

    const loggedinUser = req.landlord;

    const currentPage = parseInt(page) || 1;
    const currentLimit = parseInt(limit) || 10;
    const skip = (currentPage - 1) * currentLimit;

    const query: any = {
        isDeleted: false,
        landlord: loggedinUser?.landlord
    };

    if (search) {
        const tenantIds = await Tenant.find({ name: { $regex: search, $options: 'i' } }).distinct('_id');
        const propertyIds = await Property.find({ name: { $regex: search, $options: 'i' } }).distinct('_id');

        query.$or = [
            { tenant: { $in: tenantIds } },
            { property: { $in: propertyIds } }
        ];
    }

    const totalRecords = await TenantHistory.countDocuments(query);

    let result;
    if (isFetchAll === "true" || isFetchAll === true) {
        result = await TenantHistory.find(query)
            .populate('property')
            .populate('tenant');
    } else {
        result = await TenantHistory.find(query)
            .populate('property')
            .populate('tenant')
            .skip(skip)
            .limit(currentLimit);
    }

    return res.status(200).json({
        message: "All tenant history retrieved successfully",
        result,
        pagination: {
            total: totalRecords,
            page: currentPage,
            limit: currentLimit,
            totalPages: Math.ceil(totalRecords / currentLimit),
        },
    });
});




export const getTenantHistoryByPropertyId = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    const rules: validationRulesSchema = { id: { required: true, type: "string" } };
    const { isError, error } = customValidator({ id }, rules);
    if (isError) return res.status(400).json({ message: "Validation error", error });
    const result = await TenantHistory.findOne({ _id: id, isDeleted: false }).populate("property").populate("tenant");

    // const result = await TenantHistory.find({ property: id, isDeleted: false }).populate("property").populate("tenant")

    if (!result) {
        return res.status(406).json({ message: "No tenant history found for this property" });
    }
    // res.status(200).json({ result });

    res.status(200).json({ message: "Tenant history retrieved successfully", result });
});
export const deleteTenantHistory = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    const rules: validationRulesSchema = { id: { required: true, type: "string" } };
    const { isError, error } = customValidator({ id }, rules);
    if (isError) return res.status(400).json({ message: "Validation error", error });

    const result = await TenantHistory.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

    if (!result) return res.status(406).json({ message: "Tenant history record not found" });

    res.status(200).json({ message: "Tenant history marked as deleted successfully", result });
});

export const viewTenantHistory = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const result = await Tenant.find().populate('tenant').populate('property')
    res.json({ message: "Tenant history retrieved successfully", result });
});

export const updateTenantHistory = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const result = await TenantHistory.findByIdAndUpdate(id, req.body, { new: true });

    if (!result) return res.status(404).json({ message: "TenantHistory not found" });

    res.status(200).json({ message: "TenantHistory updated successfully", result });
});


export const createNotification = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { landlord, message, } = req.body;

    const rules: validationRulesSchema = {
        landlord: { required: true, type: "string" },
        message: { required: true, type: "string" },

    };

    const { isError, error } = customValidator(req.body, rules);
    if (isError) {
        return res.status(400).json({ message: "Validation error", error });
    }


    const result = await Notification.create({
        landlord,
        message,

    });

    return res.status(201).json({
        message: "Notification created successfully",
        result,
    });
}
);

export const getAllNotifications = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { page, limit, isFetchAll = false }: any = req.query;
    const currentPage = parseInt(page) || 1;
    const currentLimit = parseInt(limit) || 10;
    const skip = (currentPage - 1) * currentLimit;

    const loggedInLandlord = req.landlord;

    const query: any = {
        isDeleted: false,
        user: loggedInLandlord?.landlord
    };

    const totalNotifications = await Notification.countDocuments(query);

    let result;
    if (isFetchAll) {
        result = await Notification.find(query).populate("user");
    } else {
        result = await Notification.find(query)
            .populate("user")
            .skip(skip)
            .limit(currentLimit);
    }

    return res.status(200).json({
        message: "All notifications retrieved successfully",
        result,
        pagination: {
            total: totalNotifications,
            page: currentPage,
            limit: currentLimit,
            totalPages: Math.ceil(totalNotifications / currentLimit),
        },
    });
});

export const viewNotifications = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { tenant } = req.params;

    const result = await Notification.find({ recipient: tenant }).sort({ createdAt: -1 });

    res.status(200).json({ message: "Notifications retrieved", result });
});


export const getNotificationsByUser = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { userId } = req.params;
    const rules: validationRulesSchema = { userId: { required: true, type: "string" } };
    const { isError, error } = customValidator({ userId }, rules);
    if (isError) return res.status(400).json({ message: "Validation error", error });

    const result = await Notification.find({ userId, isDeleted: false }).populate("user");

    if (!result.length) return res.status(406).json({ message: "No notifications found for this user" });

    res.status(200).json({ message: "User notifications retrieved successfully", result });
});
export const markAsSeen = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const rules: validationRulesSchema = { id: { required: true, type: "string" } };
    const { isError, error } = customValidator({ id }, rules);
    if (isError) return res.status(400).json({ message: "Validation error", error });

    const result = await Notification.findByIdAndUpdate(id, { seen: true }, { new: true });

    if (!result) return res.status(406).json({ message: "Notification not found" });

    res.status(200).json({ message: "Notification marked as seen", result });
});
export const deleteNotification = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const rules: validationRulesSchema = { id: { required: true, type: "string" } };
    const { isError, error } = customValidator({ id }, rules);
    if (isError) return res.status(400).json({ message: "Validation error", error });

    const result = await Notification.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

    if (!result) return res.status(406).json({ message: "Notification not found" });

    res.status(200).json({ message: "Notification marked as deleted successfully", result });
});
export const sendTenantNotification = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const result = await Notification.create(req.body);
    if (!result) {
        return res.status(406).json({ message: "Maintenance request not found" });
    }
    res.json({ message: "Notification sent successfully", result });

});


export const scheduleEmailNotifications = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const job = new CronJob(
        "0 10 * * *",
        async () => {
            console.log("Running daily notification job...");

            const tenants = await Tenant.find({ isDeleted: false });

            for (const tenant of tenants) {
                console.log(`Tenant ID: ${tenant._id}`);
                const message = `Hello ${tenant.name}, your rent payment is due soon!`;

                await Notification.create({
                    landlord: tenant.landlord,
                    tenant: tenant._id,


                    message,
                    type: "Your rent payment is due soon",
                    seen: false,
                });

                if (tenant.email) {
                    await sendEmail({
                        to: tenant.email,
                        subject: "Rent Reminder",
                        text: message,
                        html: `
                          <div>
                            <h3>Hello ${tenant.name},</h3>
                            <p><strong>Reminder:</strong> Your rent payment is due soon.</p>
                            <p>Please make your payment on time to avoid penalties.</p>
                            <p>Thank you!<br/>Landlord Management Team</p>
                          </div>
                        `
                    });
                }

                console.log(`Notification sent to ${tenant.name}`);
            }
        },
        null,
        true,
        "Asia/Kolkata"
    );

    job.start();

    res.status(200).json({ message: "Notification job scheduled to run every day at 10AM" });
});



export const createTax = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const landlord = req.landlord;

    const rules: validationRulesSchema = {
        landlord: { required: true },
        property: { required: true, type: "string" },
        taxType: { required: true, number: true },
        taxAmount: { required: true, number: true },
        dueDate: { required: true, number: true },
        paid: { required: true, boolean: true },
    };

    const { isError, error } = customValidator({ landlord, ...req.body }, rules);

    if (isError) {
        return res.status(400).json({ message: "Validation error", error });
    }

    const result = await Tax.create({ landlord, ...req.body });

    res.status(201).json({ message: "Tax record created successfully", result });
});




export const getAllTaxes = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { search = "", page = "1", limit = "10", isFetchAll = "false" } = req.query;
    const landlord = req.landlord;
    console.log("landlord;>", landlord);

    if (!landlord) {
        return res.status(401).json({ message: "not found landlord " });
    }

    const currentPage = parseInt(page as string, 10);
    const currentLimit = parseInt(limit as string, 10);
    const skip = (currentPage - 1) * currentLimit;

    const filter: any = {
        isDeleted: false,
        landlord: landlord,
    };

    if (search) {
        const matchedPropertyIds = await Property.find({
            name: { $regex: search, $options: "i" },
            landlord: landlord,
        }).distinct("landlord").populate("property");

        filter.$or = [
            { property: { $in: matchedPropertyIds } },
            { taxType: { $regex: search, $options: "i" } },
        ];
    }

    let result = [];
    let total = 0;

    if (isFetchAll === "true") {
        result = await Tax.find(filter).populate("property");
        total = result.length;
    } else {
        total = await Tax.countDocuments(filter);
        result = await Tax.find(filter)
            .populate("property")
            .skip(skip)
            .limit(currentLimit);
    }

    res.status(200).json({
        success: true,
        message: "All taxes fetched successfully",
        result,
        pagination: {
            total,
            page: currentPage,
            limit: currentLimit,
            totalPages: Math.ceil(total / currentLimit),
        },
    });
});


export const getTaxesByPropertyId = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const rules: validationRulesSchema = { id: { required: true, type: "string" } };
    const { isError, error } = customValidator({ id }, rules);
    if (isError) return res.status(400).json({ message: "Validation error", error });

    const result = await Tax.findOne({ _id: id, isDeleted: false }).populate("property");
    res.status(200).json({ message: "Tax records retrieved successfully", result });
});

export const updateTaxPaymentStatus = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    const { property, taxType, taxAmount, dueDate, paid } = req.body;
    const result = await Tax.findByIdAndUpdate(id, { property, taxType, taxAmount, dueDate, paid }, { new: true });

    if (!result) return res.status(406).json({ message: "Tax record not found" });

    res.status(200).json({ message: "Tax payment status updated successfully", result });
});
export const deleteTax = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const result = await Tax.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!result) return res.status(400).json({ message: "Tax record not found" });

    res.status(200).json({ message: "Tax record deleted successfully", result });
});






export const createLease = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const landlord = req.landlord;
    const { tenant, property, startDate, endDate, rentAmount, securityDeposit, terms, status } = req.body;

    const rules: validationRulesSchema = {
        tenant: { required: true },
        property: { required: true },
        landlord: { required: true },
        startDate: { required: true, type: "date" },
        endDate: { required: true, type: "date" },
        rentAmount: { required: true },
        securityDeposit: { required: true },
        terms: { required: true },
        status: { required: true, enum: ["active", "terminated"] },
    };

    const { isError, error } = customValidator({ tenant, property, landlord, startDate, endDate, rentAmount, securityDeposit, terms, status }, rules);
    if (isError) return res.status(400).json({ message: "Validation error", error });

    const result = await Lease.create({
        tenant, property, landlord, startDate, endDate, rentAmount, securityDeposit, terms, status,
    });
    res.status(201).json({ message: "Lease created successfully", result });
});

export const getAllLeases = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const landlord = req.landlord;
    const { search = "", page = "1", limit = "10", isFetchAll = "false" } = req.query;

    if (!landlord) {
        return res.status(401).json({ message: "Landlord not found" });
    }

    const currentPage = parseInt(page as string);
    const currentLimit = parseInt(limit as string);
    const skip = (currentPage - 1) * currentLimit;

    const filter: any = {
        landlord: landlord,
        isDeleted: false,
    };

    if (search) {
        filter.terms = { $regex: search as string, $options: "i" };
    }

    let result;
    let total = 0;

    if (isFetchAll === "true") {
        result = await Lease.find(filter).populate("tenant").populate("property");
        total = result.length;
    } else {
        total = await Lease.countDocuments(filter);
        result = await Lease.find(filter)
            .populate("tenant")
            .populate("property")
            .skip(skip)
            .limit(currentLimit);
    }

    return res.status(200).json({
        success: true,
        message: "All leases retrieved successfully",
        result,
        pagination: isFetchAll === "true"
            ? null
            : {
                total,
                page: currentPage,
                limit: currentLimit,
                totalPages: Math.ceil(total / currentLimit),
            },
    });
});


export const getLeaseById = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    const rules: validationRulesSchema = { id: { required: true, type: "string" } };
    const { isError, error } = customValidator({ id }, rules);
    if (isError) return res.status(400).json({ message: "Validation error", error });
    const result = await Lease.findOne({ _id: id }).populate("tenant").populate("property");

    // const result = await Lease.findById(id).populate("tenant property");
    if (!result) return res.status(406).json({ message: "Lease not found" });

    res.status(200).json({ result });
});
export const updateLease = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const result = await Lease.findByIdAndUpdate(id, req.body, { new: true });

    if (!result) return res.status(406).json({ message: "Lease not found" });

    res.status(200).json({ message: "Lease updated successfully", result });
});
export const terminateLease = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    const rules: validationRulesSchema = { id: { required: true } };
    const { isError, error } = customValidator({ id }, rules);
    if (isError) return res.status(400).json({ message: "Validation error", error });

    const result = await Lease.findByIdAndUpdate(id, { status: "terminated" }, { new: true });

    if (!result) return res.status(406).json({ message: "Lease not found" });

    res.status(200).json({ message: "Lease marked as terminated successfully", result });
});
export const deleteLease = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    const rules: validationRulesSchema = {
        id: { required: true },
    };
    const { isError, error } = customValidator({ id }, rules);
    if (isError) {
        return res.status(400).json({ message: "Validation error", error });
    }

    const result = await Lease.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!result) {
        return res.status(400).json({ message: "Lease not found" });
    }

    return res.status(200).json({ message: "Lease marked as deleted successfully", result });
});
export const viewLeaseDetails = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { tenant } = req.params;
    const result = await Lease.findOne({ tenant: tenant }).populate("Property");
    if (!result) {
        return res.status(406).json({ message: "view detail  not found" });
    }
    res.status(200).json({ message: "Lease details retrieved", result });
});







export const createMaintenanceRequest = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const landlord = req.landlord?.landlord;
    const { tenant, property, description } = req.body;

    const rules: validationRulesSchema = {
        tenant: { required: true, type: "string" },
        property: { required: true, type: "string" },
        description: { required: true, type: "string" },
        landlord: { required: true },
    };

    const { isError, error } = customValidator({ tenant, property, description, landlord }, rules);
    if (isError) {
        return res.status(400).json({ message: "Validation error", error });
    }

    const result = await MaintenanceRequest.create({
        tenant,
        property,
        landlord,
        description,
    });

    return res.status(201).json({
        message: "Maintenance request created successfully",
        result,
    });
});




export const getAllMaintenanceRequests = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { search = "", page = 1, limit = 10, isFetchAll }: any = req.query;

    const currentPage = parseInt(page);
    const currentLimit = parseInt(limit);
    const skip = (currentPage - 1) * currentLimit;

    const loggedInLandlord = req.landlord;

    const searchQuery: any = {
        isDeleted: false,
    };

    if (search) {
        searchQuery.description = { $regex: search, $options: "i" };
    }

    if (loggedInLandlord?.landlord) {

        const propertyIds = await Property.find({ landlord: loggedInLandlord?.landlord }).distinct('landlord');
        searchQuery.property = { $in: propertyIds };
    }

    let result;
    let total = 0;

    if (isFetchAll === "true") {
        result = await MaintenanceRequest.find(searchQuery)
            .populate("tenant")
            .populate("property");
        total = result.length;
    } else {
        result = await MaintenanceRequest.find(searchQuery)
            .populate("tenant")
            .populate("property")
            .skip(skip)
            .limit(currentLimit);

        total = await MaintenanceRequest.countDocuments(searchQuery);
    }

    return res.status(200).json({
        message: "All maintenance requests retrieved successfully",
        result,
        pagination: isFetchAll === "true"
            ? null
            : {
                total,
                page: currentPage,
                limit: currentLimit,
                totalPages: Math.ceil(total / currentLimit),
            },
    });
});

export const getMaintenanceRequestById = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const result = await MaintenanceRequest.findById({ _id: id }).populate("tenant").populate("property");
    if (!result) return res.status(400).json({ message: "Maintenance request not found" });

    res.status(200).json({ result });
});
export const updateMaintenanceRequest = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const result = await MaintenanceRequest.findByIdAndUpdate(id, req.body, { new: true });

    if (!result) return res.status(400).json({ message: "Maintenance request not found" });

    res.status(200).json({ message: "Maintenance request updated successfully", result });
});
export const completeMaintenanceRequest = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    const result = await MaintenanceRequest.findByIdAndUpdate(id, { status: "completed" }, { new: true });
    if (!result) return res.status(400).json({ message: "Maintenance request not found" });

    res.status(200).json({ message: "Maintenance request marked as completed", result });
});
export const deleteMaintenanceRequest = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    const result = await MaintenanceRequest.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!result) return res.status(400).json({ message: "Maintenance request not found" });

    res.status(200).json({ message: "Maintenance request deleted successfully", result });
});
export const approveMaintenanceRequest = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const result = await MaintenanceRequest.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });

    if (!result) {
        return res.status(404).json({ message: "Maintenance request not found" });
    }

    res.json({ message: "Maintenance request approved", result });
});
export const requestMaintenance = asyncHandler(async (req: Request, res: Response) => {
    const result = await MaintenanceRequest.create(req.body);
    res.status(201).json({ message: "Maintenance request submitted", result });
});













export const createTenant = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(400).json({ message: "File upload error", error: err.message });
        }

        try {
            console.log("Request Body:", req.body);
            console.log("Uploaded Files:", req.files);

            const {
                property,
                name,
                mobile,
                leaseStart,
                leaseEnd,
                rentAmount,
                securityDeposit,
                status
            } = req.body;

            const landlord = req.landlord;
            if (!landlord) {
                return res.status(401).json({ message: "Unauthorized: Landlord not found" });
            }

            const uploadedFiles = req.files as { [fieldname: string]: Express.Multer.File[] };

            const image = uploadedFiles?.image?.[0]?.filename || "dummy.jpg";
            const documents = uploadedFiles?.documents?.map(file => file.filename) || [];

            console.log("Image:", image);
            console.log("Documents:", documents);

            const result = await Tenant.create({
                landlord,
                property,
                name,
                mobile,
                leaseStart,
                leaseEnd,
                rentAmount,
                securityDeposit,
                status: status || "pending",
                image,
                documents
            });

            res.status(201).json({ message: "Tenant created successfully", result });
        } catch (error: any) {
            console.error("Tenant creation error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    });
});






export const getAllTenants = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { search = "", page = "1", limit = "10", isFetchAll = "false" } = req.query;

    const currentPage = parseInt(page as string, 10);
    const currentLimit = parseInt(limit as string, 10);
    const skip = (currentPage - 1) * currentLimit;
    const currentSearch = search as string;

    const loggedInLandlord = req.landlord;
    const query: any = { isDeleted: false };

    if (loggedInLandlord?.landlord) {
        const propertyIds = await Property.find({ landlord: loggedInLandlord.landlord }).distinct('_id');
        query.property = { $in: propertyIds };
    }

    if (currentSearch) {
        query.$or = [
            { name: { $regex: currentSearch, $options: "i" } },
            { mobile: { $regex: currentSearch, $options: "i" } },
            { status: { $regex: currentSearch, $options: "i" } },
        ];
    }

    const totalTenants = await Tenant.countDocuments(query);

    const result = isFetchAll === "true"
        ? await Tenant.find(query).populate("property")
        : await Tenant.find(query).populate("property").skip(skip).limit(currentLimit);

    return res.status(200).json({
        message: "All tenants retrieved successfully",
        result,
        pagination: {
            total: totalTenants,
            page: currentPage,
            limit: currentLimit,
            totalPages: Math.ceil(totalTenants / currentLimit),
        },
    });
});





export const getTenantById = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const result = await Tenant.findById(req.params.id);
    if (!result) {
        return res.status(500).json({ message: "tenant not found" });
    }
    res.status(200).json({ message: "tenant by id successfully", result });
});
export const updateTenant = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    console.log("Request Body:", req.body);
    console.log("Request Params ID:", req.params.id);
    const result = await Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true });


    if (!result) {
        return res.status(400).json({ message: "Tenant not found" });
    }
    res.status(200).json({ message: "Tenant updated successfully", result });
});
export const deleteTenant = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const result = await Tenant.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!result) {
        return res.status(400).json({ message: "Tenant not found" });
    }
    res.status(200).json({ message: "Tenant deleted successfully", result });
});




export const getAllBills = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { search, page, limit, isFetchAll = false }: any = req.query;

    const currentPage = parseInt(page) || 1;
    const currentLimit = parseInt(limit) || 10;
    const skip = (currentPage - 1) * currentLimit;
    const currentSearch = search || "";

    const loggedInLandlord = req.landlord;

    const baseQuery: any = {
        isDeleted: false,
    };


    if (currentSearch) {
        baseQuery.$or = [
            { billType: { $regex: currentSearch, $options: 'i' } },
        ];
    }


    if (loggedInLandlord?.landlord) {
        const propertyIds = await Property.find({ landlord: loggedInLandlord.landlord }).distinct('landlord');
        baseQuery.property = { $in: propertyIds };
    }

    const totalBills = await UtilityBill.countDocuments(baseQuery);
    let result;

    if (isFetchAll === "true") {
        result = await UtilityBill.find(baseQuery)
            .populate("property");
    } else {
        result = await UtilityBill.find(baseQuery)
            .populate("property")
            .skip(skip)
            .limit(currentLimit);
    }

    return res.status(200).json({
        message: "All bills retrieved successfully",
        result,
        pagination: isFetchAll === "true" ? null : {
            total: totalBills,
            page: currentPage,
            limit: currentLimit,
            totalPages: Math.ceil(totalBills / currentLimit)
        }
    });
});


export const getBillbyId = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    const rules: validationRulesSchema = {
        id: { required: true, type: "string" },
    };

    const { isError, error } = customValidator({ id }, rules);

    if (isError) {
        return res.status(532).json({ message: "Validation error", error });
    }

    const result = await UtilityBill.findById(id).populate("property");

    if (!result) {
        return res.status(406).json({ message: "Bill not found" });
    }

    res.status(200).json({ result });
});


export const createBill = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { property, landlord, billType, amount, dueDate, paid } = req.body;

    const rules: validationRulesSchema = {
        property: { required: true },
        landlord: { required: true }, // ✅ added validation for landlord
        billType: { required: true },
        amount: { required: true, number: true },
        dueDate: { required: true, date: true },
        paid: { required: false, boolean: true },
    };

    const { isError, error } = customValidator(req.body, rules);

    if (isError) {
        return res.status(400).json({ message: "Validation error", error });
    }

    const result = await UtilityBill.create({
        property,
        landlord,
        billType,
        amount,
        dueDate,
        paid,
    });

    return res.status(201).json({ message: "Utility bill created successfully", result });
});

export const updateBill = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    console.log(req.params.id, req.body);
    const { id } = req.params;
    const result = await UtilityBill.findByIdAndUpdate(id, req.body, { new: true });
    if (!result) {
        return res.status(404).json({ message: "Bill not found" });
    }
    res.status(200).json({ message: "Bill status updated successfully", result });
});
export const markBillAsPaid = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    const result = await UtilityBill.findByIdAndUpdate(id, { paid: true }, { new: true });
    if (!result) {
        return res.status(404).json({ message: "Bill not found" });
    }

    return res.status(200).json({ message: "bill marked as paid successfully", result });
});
export const deleteBill = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    const rules: validationRulesSchema = {
        id: { required: true, },
    };
    const { isError, error } = customValidator({ id }, rules);
    if (isError) {
        return res.status(532).json({ message: "Validation Error", error });
    }
    const result = await UtilityBill.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!result) {
        return res.status(400).json({ message: "delte not found" });
    }
    return res.status(200).json({ message: "delete marked as deleted successfully", result });
});

export const payUtilityBills = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const result = await UtilityBill.create(req.body);
    res.json({ message: "Utility bill paid successfully", result });
});



export const createPayment = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { tenant, property, amount, paymentType, paymentDate, paymentMethod, status, date } = req.body;
    const landlord = req.landlord;

    const rules: validationRulesSchema = {
        tenant: { required: true, type: "string" },
        property: { required: true, type: "string" },
        landlord: { required: true },
        amount: { required: true, type: "number" },
        paymentType: { required: true, type: "string", enum: ["rent", "tax", "utility"] },
        paymentDate: { required: true, type: "date" },
        paymentMethod: { required: true, type: "string", enum: ["creditCard", "debitCard", "bankTransfer", "cash"] },
        status: { required: true, type: "string", enum: ["pending", "completed", "failed"] },
    };

    const { isError, error } = customValidator({ tenant, property, landlord, amount, paymentType, paymentDate, paymentMethod, status }, rules);
    if (isError) {
        return res.status(400).json({ message: "Validation error", error });
    }

    const result = await Payment.create({
        tenant,
        property,
        landlord,
        amount,
        paymentType,
        paymentDate,
        paymentMethod,
        status,
        date,
    });

    return res.status(201).json({
        message: "Payment created successfully", result,
    });
});




export const getAllPayments = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { page = 1, limit = 10, isFetchAll = false, search = "" }: any = req.query;

    const currentPage = parseInt(page) || 1;
    const currentLimit = parseInt(limit) || 10;
    const skip = (currentPage - 1) * currentLimit;

    const landlord = req.landlord;

    const query: any = {
        isDeleted: false,
    };

    if (search) {
        query.$or = [
            { paymentType: { $regex: search, $options: 'i' } },
            { paymentMethod: { $regex: search, $options: 'i' } },
            { status: { $regex: search, $options: 'i' } },
        ];
    }

    if (landlord?.landlord) {
        const propertyIds = await Property.find({ landlord: landlord.landlord }).distinct('landlord');
        query.property = { $in: propertyIds };
    }

    const totalPayments = await Payment.countDocuments(query);

    const payments = isFetchAll === "true"
        ? await Payment.find(query).populate("tenant").populate("property")
        : await Payment.find(query)
            .populate("tenant")
            .populate("property")
            .skip(skip)
            .limit(currentLimit);

    // Send response
    res.status(200).json({
        message: "All payments retrieved successfully",
        result: payments,
        pagination: isFetchAll === "true" ? null : {
            total: totalPayments,
            page: currentPage,
            limit: currentLimit,
            totalPages: Math.ceil(totalPayments / currentLimit),
        },
    });
});


export const getPaymentsByTenant = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const result = await Payment.find({ tenant: id, isDeleted: false }).populate("tenant").populate("property")
    if (!result.length) return res.status(406).json({ message: "No payments found for this tenant" });
    res.status(200).json({ message: "Tenant payments retrieved successfully", result });
});


export const updatePaymentStatus = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { paymentId } = req.params;
    const { status } = req.body;

    const result = await Payment.findByIdAndUpdate(paymentId, { status }, { new: true });
    if (!result) return res.status(406).json({ message: "Payment not found" });
    res.status(200).json({ message: "Payment status updated successfully", result });
});
export const deletePayment = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const result = await Payment.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!result) return res.status(406).json({ message: "Payment not found" });
    res.status(200).json({ message: "Payment marked as deleted successfully", result });
});



export const createContract = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const landlord = req.landlord;
    const rules: validationRulesSchema = {
        landlord: { required: true, type: "string" },
        property: { required: true, type: "string" },
        tenant: { required: true, type: "string" },
        startDate: { required: true, type: "date" },
        expiryDate: { required: true, type: "date" },
    };

    const { isError, error } = customValidator({ landlord, ...req.body }, rules);
    if (isError) {
        return res.status(400).json({ message: "Validation error", error });
    }

    const { property, tenant, startDate, expiryDate } = req.body;

    const contract = await Contract.create({ property, tenant, startDate, expiryDate, landlord });

    return res.status(201).json({ message: "Contract created successfully", contract });
});



export const getContractById = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    const rules: validationRulesSchema = {
        id: { required: true, type: "string" },
    };

    const { isError, error } = customValidator({ id }, rules);
    if (isError) {
        return res.status(400).json({ message: "Validation error", error });
    }
    // const contract = await Contract.findById(id).populate("property").populate("tenant");

    const contract = await Contract.findOne({ _id: id }).populate("tenant").populate("property");

    if (!contract) {
        return res.status(400).json({ message: "Contract not found" });
    }

    res.status(200).json({
        message: "Contract retrieved successfully",
        result: contract,
    });
});

export const updateContract = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const result = await Contract.findByIdAndUpdate(id, req.body, { new: true });
    if (!result) {
        return res.status(400).json({ message: "Contract not found" });
    }
    res.status(200).json({ message: "Contract updated successfully", result });
});
export const deleteContract = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    const rules: validationRulesSchema = {
        id: { required: true },
    };
    const { isError, error } = customValidator({ id }, rules);
    if (isError) {
        return res.status(400).json({ message: "Validation error", error });
    }

    const contract = await Contract.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!contract) {
        return res.status(400).json({ message: "Contract not found" });
    }

    return res.status(200).json({ message: "Contract marked as deleted successfully", contract });
});






export const getAllContracts = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { search, page, limit, isFetchAll = false }: any = req.query;

    const currentPage = parseInt(page) || 1;
    const currentLimit = parseInt(limit) || 10;
    const skip = (currentPage - 1) * currentLimit;
    const currentSearch = search || "";

    const matchStage: any = {
        isDeleted: false,
    };

    if (search) {
        matchStage.$or = [
            { 'property.name': { $regex: currentSearch, $options: 'i' } },
            { 'tenant.name': { $regex: currentSearch, $options: 'i' } },
        ];
    }

    const aggregationPipeline: any[] = [
        {
            $lookup: {
                from: "properties",
                localField: "property",
                foreignField: "_id",
                as: "property",
            },
        },
        { $unwind: "$property" },
        {
            $lookup: {
                from: "tenants",
                localField: "tenant",
                foreignField: "_id",
                as: "tenant",
            },
        },
        { $unwind: "$tenant" },
        {
            $match: matchStage,
        },
    ];

    const totalContractsPipeline: any[] = [...aggregationPipeline, { $count: "total" }];
    const totalContractsResult = await Contract.aggregate(totalContractsPipeline);
    const totalContracts = totalContractsResult[0]?.total || 0;

    if (!isFetchAll) {
        aggregationPipeline.push({ $skip: skip });
        aggregationPipeline.push({ $limit: currentLimit });
    }

    const result = await Contract.aggregate(aggregationPipeline);

    return res.status(200).json({
        message: "All contracts retrieved successfully",
        result,
        pagination: {
            total: totalContracts,
            page: currentPage,
            limit: currentLimit,
            totalPages: Math.ceil(totalContracts / currentLimit),
        },
    });
});





export const blockLandlord = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    const landlord = await Landlord.findById(id);
    if (!landlord) {
        return res.status(406).json({ message: "Landlord not found" });
    }

    landlord.isBlock = true;
    await landlord.save();

    res.status(200).json({ message: "Landlord blocked successfully", landlord });
});



export const getLandlordDashboardData = asyncHandler(async (req: Request, res: Response) => {
    const landlord = req.landlord;

    const [
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
        Tenant.countDocuments({ landlord: landlord, isDeleted: false }),
        Property.countDocuments({ landlord: landlord, isDeleted: false }),
        Lease.countDocuments({ landlord: landlord, isDeleted: false }),
        Contract.countDocuments({ landlord: landlord, isDeleted: false }),
        TenantHistory.countDocuments({ landlord: landlord, isDeleted: false }),
        MaintenanceRequest.countDocuments({ landlord: landlord, isDeleted: false }),
        Tax.countDocuments({ landlord: landlord, isDeleted: false }),
        UtilityBill.countDocuments({ landlord: landlord, isDeleted: false }),
        Payment.countDocuments({ landlord: landlord, isDeleted: false }),
        RentalAgreement.countDocuments({ landlord: landlord, isDeleted: false }),
    ]);

    const recentPayments = await Payment.find({ landlord: landlord, isDeleted: false })
        .populate("tenant property")
        .sort({ createdAt: -1 })
        .limit(10);

    const recentTenants = await Tenant.find({ landlord: landlord, isDeleted: false })
        .populate("property")
        .sort({ createdAt: -1 })
        .limit(10);

    const recentMaintenance = await MaintenanceRequest.find({ landlord: landlord, isDeleted: false })
        .populate("property")
        .sort({ createdAt: -1 })
        .limit(10);

    const recentProperties = await Property.find({ landlord: landlord, isDeleted: false })
        .populate("landlord")
        .sort({ createdAt: -1 })
        .limit(10);

    res.status(200).json({
        message: "Landlord dashboard data retrieved successfully",
        data: {
            totals: {
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
