import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect } from "react";
import { useVerifyOTPMutation } from "../redux/api/auth.api";
import { useNavigate } from "react-router-dom";
const otpSchema = z.object({
    identifier: z.string().min(5, "Enter a valid email or mobile number"),
    otp: z.string().length(6, "OTP must be 6 digits"),
});

const AdminVerifyOTP = () => {
    const [verifyOTP, { isSuccess, isError, isLoading }] = useVerifyOTPMutation();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<{ identifier: string; otp: string }>({
        resolver: zodResolver(otpSchema),
    });

    useEffect(() => {
        if (isSuccess) {
            toast.success("OTP verified successfully!");
        }
    }, [isSuccess]);

    useEffect(() => {
        if (isError) {
            toast.error("Invalid OTP. Please try again.");
        }
    }, [isError]);


    const isEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

    const onSubmit = async (data: { identifier: string; otp: string }) => {
        try {
            const payload = isEmail(data.identifier)
                ? { email: data.identifier, otp: data.otp }
                : { mobile: data.identifier, otp: data.otp };

            console.log("Payload:", payload);

            await verifyOTP(payload);
        } catch (error) {
            console.error("OTP verification failed", error);
        }
    };


    useEffect(() => {
        if (isSuccess) {
            toast.success("OTP sent successfully!");
            navigate("/admin/otp");
        }
    }, [isSuccess, navigate]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <Card className="w-96 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center">Verify OTP</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Input

                            type="text"
                            placeholder="Enter email or mobile"
                            {...register("identifier")}
                        />
                        {errors.identifier && <p className="text-red-500 text-sm">{errors.identifier.message}</p>}


                        <Input
                            className="mt-5"
                            type="text"
                            placeholder="Enter OTP"
                            {...register("otp")}
                        />
                        {errors.otp && <p className="text-red-500 text-sm">{errors.otp.message}</p>}


                        <Button type="submit" className="w-full mt-3" disabled={isLoading}>
                            {isLoading ? "Verifying..." : "Verify OTP"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminVerifyOTP;
