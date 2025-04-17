import { NextFunction, Request, Response } from "express";
import { IUserProtected } from "./protected";
import { Clinic } from "../models/Clinic";

export const checkSubscription = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

    const { clinicId } = req.user as IUserProtected

    const clinic = await Clinic.findById({ _id: clinicId });

    if (!clinic) {
        return res.status(404).json({ message: "Clinic not found" });
    }

    if (clinic.status === "inactive") {
        return res.status(403).json({ message: "Subscription expired. Please renew your plan." });
    }

    next();
};


// const checkSubscription = async (req: Request, res: Response, next: NextFunction) => {
//     const { clinicId } = req.user as IUserProtected

//     const cachedStatus = await redisClient.get(`clinicStatus:${clinicId}`);

//     if (cachedStatus === "inactive") {
//         return res.status(403).json({ message: "Subscription expired. Please renew your plan." });
//     }

//     if (!cachedStatus) {
//         const clinic = await Clinic.findById(clinicId);
//         if (!clinic) {
//             return res.status(404).json({ message: "Clinic not found" });
//         }

//         // Cache status in Redis for 1 hour
//         await redisClient.setEx(`clinicStatus:${clinicId}`, 3600, clinic.status);

//         if (clinic.status === "inactive") {
//             return res.status(403).json({ message: "Subscription expired. Please renew your plan." });
//         }
//     }

//     next();
// };

