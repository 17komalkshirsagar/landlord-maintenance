

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    useSignInMutation,
    useVerifyOTPMutation,
} from "../redux/api/auth.api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const adminLoginSchema = z.object({
    identifier: z
        .string()
        .min(5, "Enter a valid email or mobile"),
    otp: z.string().optional(),
});

const AdminLogin = () => {
    const navigate = useNavigate();
    const [otpSent, setOtpSent] = useState(false);
    const [userIdentifier, setUserIdentifier] = useState("");

    const [signIn, { isLoading: isLoginLoading }] = useSignInMutation();
    const [verifyOTP, { isLoading: isVerifying, isSuccess: verifySuccess }] = useVerifyOTPMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(adminLoginSchema),
    });

    const handleSendOTP = async (data: any) => {
        const identifier = data.identifier;
        const payload = {
            email: identifier.includes("@") ? identifier : "",
            mobile: identifier.includes("@") ? "" : identifier,
        };

        try {
            await signIn(payload).unwrap();
            toast.success("OTP sent successfully!");
            setOtpSent(true);
            setUserIdentifier(identifier);
        } catch (error) {
            toast.error("Failed to send OTP.");
        }
    };

    const handleVerifyOTP = async (data: any) => {
        try {
            const payload = {
                email: userIdentifier.includes("@") ? userIdentifier : "",
                mobile: userIdentifier.includes("@") ? "" : userIdentifier,
                otp: data.otp,
            };

            await verifyOTP(payload).unwrap();
        } catch (error) {
            toast.error("OTP verification failed!");
        }
    };

    useEffect(() => {
        if (verifySuccess) {
            toast.success("OTP verified successfully!");
            navigate("/admin");
        }
    }, [verifySuccess, navigate]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold text-center mb-4">
                    Admin Login
                </h2>

                <form onSubmit={handleSubmit(otpSent ? handleVerifyOTP : handleSendOTP)}>
                    <div>
                        <Input
                            placeholder="Enter Email or Mobile"
                            {...register("identifier")}
                            disabled={otpSent}
                        />
                        {errors.identifier && (
                            <p className="text-red-500 text-sm">{errors.identifier.message?.toString()}</p>
                        )}
                    </div>

                    {otpSent && (
                        <div className="mt-4">
                            <Input
                                placeholder="Enter OTP"
                                {...register("otp", {
                                    required: "OTP is required",
                                    minLength: {
                                        value: 4,
                                        message: "OTP must be at least 4 digits",
                                    },
                                })}
                            />
                            {errors.otp && (
                                <p className="text-red-500 text-sm">{errors.otp?.message?.toString()}</p>
                            )}

                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full mt-4"
                        disabled={isLoginLoading || isVerifying}
                    >
                        {otpSent
                            ? isVerifying
                                ? "Verifying..."
                                : "Verify OTP"
                            : isLoginLoading
                                ? "Sending OTP..."
                                : "Send OTP"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
