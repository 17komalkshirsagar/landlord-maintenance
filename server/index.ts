import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import passport from "./services/passport"
import redisClient from "./services/redisClient";
import adminRouter from "./routes/admin.routes";
import landlordRouter from "./routes/landload.routes";

import authRouter from "./routes/auth.routes";
import { protectLandlord } from "./midleware/authMiddleware";
import rezorpayRouter from "./routes/rezorpay.routes";

dotenv.config()
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static("invoices"))
app.use(morgan("dev"))



app.use(cors({
    origin: true,
    credentials: true
}))

app.use(passport.initialize())
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/landlord", protectLandlord, landlordRouter)
app.use('/api/v1/payment', protectLandlord, rezorpayRouter);



redisClient.on("connect", () => {
    console.log('Connected to Redis');
})

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: "Resource not found", });
})

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({ message: "Something went wrong", error: err.message });
})

mongoose.connect(process.env.MONGO_URL || "").catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
});




const PORT = process.env.PORT || 5000
mongoose.connection.once("open", async () => {
    console.log("MongoDb Connected")
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`)
    });
});

