import { NextFunction, Request, Response } from "express";
import redisClient from "../services/redisClient";

export const cacheMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const cacheKey = req.originalUrl

        const cacheData = await redisClient.get(cacheKey);

        if (cacheData) {
            return res.json(JSON.parse(cacheData))
        }
        next()
    } catch (error) {
        return res.status(400).json({ message: "Redis Middleware Error", error })
    }
};

export const invalidateCache = async (cacheKey: string) => {
    try {
        await redisClient.del(cacheKey);
    } catch (err) {
        throw err;
    }
}