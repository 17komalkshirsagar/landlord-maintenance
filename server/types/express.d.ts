import { IAdmin } from "./../midleware/authMiddleware"
import { ILandlord } from "./../midleware/authMiddleware";
import { IUser } from "./../midleware/authMiddleware";
import { Landlord } from '../../models/Landlord.model';

declare module 'express-serve-static-core' {
    interface Request {
        landlord?: Landlord;
    }
}

export interface LandlordRequest extends Request {
    landlord: ILandlord;
}