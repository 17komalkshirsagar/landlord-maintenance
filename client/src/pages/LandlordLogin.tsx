// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//     useContinueWithGoogleMutation,
//     useLoginLandlordMutation,
//     useVerifyLandlordOTPMutation,
// } from "../redux/api/auth.api";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { toast } from "sonner";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { GoogleLogin } from '@react-oauth/google'
// import { z } from "zod";

// const landlordLoginSchema = z.object({
//     identifier: z
//         .string()
//         .min(5, "Must be at least 5 characters")
//         .max(50, "Too long!"),
//     otp: z.string().optional(),
// });

// const LandlordLogin = () => {
//     const navigate = useNavigate();
//     const [otpSent, setOtpSent] = useState(false);
//     const [userIdentifier, setUserIdentifier] = useState("");
//     // const [continueWithGoogle, { isLoading, error }] = useContinueWithGoogleMutation();
//     const [landlordLogin, { isLoading: isLoginLoading }] = useLoginLandlordMutation();
//     const [verifyOTP, { isSuccess: verifySuccess, isLoading: isVerifying }] =
//         useVerifyLandlordOTPMutation();

//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//     } = useForm({
//         resolver: zodResolver(landlordLoginSchema),
//     });

//     const handleLogin = async (data: any) => {
//         const identifier = data.identifier;
//         const payload = {
//             email: identifier.includes("@") ? identifier : "",
//             mobile: identifier.includes("@") ? "" : identifier,
//         };

//         try {
//             await landlordLogin(payload).unwrap();
//             toast.success("OTP sent successfully!");
//             setOtpSent(true);
//             setUserIdentifier(identifier);
//         } catch (error) {
//             toast.error("Failed to send OTP.");
//         }
//     };

//     // const handleGoogleLogin = (googleCredential: string, mobile: string | undefined) => {
//     //     const result = continueWithGoogle({ credential: googleCredential, mobile })
//     // };

//     const handleVerify = async (data: any) => {
//         try {
//             const payload = {
//                 email: userIdentifier.includes("@") ? userIdentifier : "",
//                 mobile: userIdentifier.includes("@") ? "" : userIdentifier,
//                 otp: data.otp,
//             };

//             await verifyOTP(payload).unwrap();

//         } catch (error) {
//             toast.error("OTP verification failed!");
//         }
//     };

//     useEffect(() => {
//         if (verifySuccess) {
//             toast.success("otp verify success ")
//             navigate("/landlord")
//         }
//     }, [verifySuccess])


//     return (
//         <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//                 <h2 className="text-xl font-semibold text-center mb-4">
//                     Landlord Login
//                 </h2>

//                 <form onSubmit={handleSubmit(otpSent ? handleVerify : handleLogin)}>
//                     <div>
//                         <Input
//                             placeholder="Enter Email or Mobile"
//                             {...register("identifier")}
//                             disabled={otpSent}
//                         />
//                         {errors.identifier && (
//                             <p className="text-red-500 text-sm">
//                                 {errors.identifier.message?.toString()}
//                             </p>
//                         )}

//                     </div>

//                     {otpSent && (
//                         <div className="mt-4">
//                             <Input
//                                 placeholder="Enter OTP"
//                                 {...register("otp", {
//                                     required: "OTP is required",
//                                     minLength: {
//                                         value: 4,
//                                         message: "OTP must be at least 4 digits",
//                                     },
//                                 })}
//                             />

//                             {errors.otp && (
//                                 <p className="text-red-500 text-sm">
//                                     {errors.otp.message?.toString()}
//                                 </p>
//                             )}

//                         </div>
//                     )}

//                     <Button
//                         type="submit"
//                         className="w-full mt-4 mb-4"
//                         disabled={isLoginLoading || isVerifying}
//                     >
//                         {otpSent
//                             ? isVerifying
//                                 ? "Verifying..."
//                                 : "Verify OTP"
//                             : isLoginLoading
//                                 ? "Sending OTP..."
//                                 : "Send OTP"}
//                     </Button>
//                     {/* OR   <Button onClick={() => handleGoogleLogin("googleCredentialHere", "mobileNumberHere")}>
//                         {isLoading ? "Logging in..." : "Continue with Google"}
//                     </Button> */}
//                     <p className="mt-2 text-sm text-center">
//                         Create an account <Link to="/landlord/Register" className="text-blue-600 underline">Register here</Link>
//                     </p>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default LandlordLogin;














import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    useContinueWithGoogleMutation,
    useLoginLandlordMutation,
    useVerifyLandlordOTPMutation,
} from "../redux/api/auth.api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleLogin } from '@react-oauth/google';
import { z } from "zod";
import { jwtDecode } from "jwt-decode";
const landlordLoginSchema = z.object({
    identifier: z
        .string()
        .min(5, "Must be at least 5 characters")
        .max(50, "Too long!"),
    otp: z.string().optional(),
});

const LandlordLogin = () => {
    const navigate = useNavigate();
    const [otpSent, setOtpSent] = useState(false);
    const [userIdentifier, setUserIdentifier] = useState("");
    const [continueWithGoogle, { isSuccess }] = useContinueWithGoogleMutation();
    const [landlordLogin, { isLoading: isLoginLoading }] = useLoginLandlordMutation();
    const [verifyOTP, { isSuccess: verifySuccess, isLoading: isVerifying }] =
        useVerifyLandlordOTPMutation();


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(landlordLoginSchema),
    });

    const handleLogin = async (data: any) => {
        const identifier = data.identifier;
        const payload = {
            email: identifier.includes("@") ? identifier : "",
            mobile: identifier.includes("@") ? "" : identifier,
        };

        try {
            await landlordLogin(payload).unwrap();
            toast.success("OTP sent successfully!");
            setOtpSent(true);
            setUserIdentifier(identifier);
        } catch (error) {
            toast.error("Failed to send OTP.");
        }
    };

    const handleGoogleLogin = (googleResponse: any) => {

        const { credential } = googleResponse;
        continueWithGoogle({ credential }).unwrap()
    };


    const handleVerify = async (data: any) => {
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
            toast.success("OTP verify success");
            navigate("/landlord");
        }
    }, [verifySuccess]);
    useEffect(() => {
        if (isSuccess) {
            toast.success("Google loginsuccess ");
            navigate("/landlord");
        }
    }, [isSuccess]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold text-center mb-4">
                    Landlord Login
                </h2>


                <form onSubmit={handleSubmit(otpSent ? handleVerify : handleLogin)}>
                    <div>
                        <Input
                            placeholder="Enter Email or Mobile"
                            {...register("identifier")}
                            disabled={otpSent}
                        />
                        {errors.identifier && (
                            <p className="text-red-500 text-sm">
                                {errors.identifier.message?.toString()}
                            </p>
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
                                <p className="text-red-500 text-sm">
                                    {errors.otp.message?.toString()}
                                </p>
                            )}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full mt-4 mb-4"
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

                <div className="w-full mb-4">
                    <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => toast.error("Google login failed")}
                        useOneTap
                    />
                </div>

                <p className="mt-2 text-sm text-center">
                    Create an account{" "}
                    <Link to="/landlord/Register" className="text-blue-600 underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LandlordLogin;
