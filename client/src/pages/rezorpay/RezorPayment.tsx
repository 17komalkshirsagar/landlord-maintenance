

import React, { useEffect } from 'react';
import { toast } from "sonner";
import { useSelector } from 'react-redux';
import {
    useInitiateOrderMutation,
    usePlacePropertiesOrderPaymentMutation,
    useVerifyPaymentMutation
} from '../../redux/api/rezorpay.api';
import { useNavigate } from 'react-router-dom';

const RezorPayment = () => {
    const [initiateOrder, { isSuccess, data }] = useInitiateOrderMutation();
    const [placeorder, { isSuccess: placeSuccess }] = usePlacePropertiesOrderPaymentMutation();
    const [verifyPayment, { isSuccess: verifySuccess }] = useVerifyPaymentMutation();
    console.log("placeorder::", placeorder);
    console.log("verifyPayment::::", verifyPayment);

    const landlord = useSelector((state: any) => state.auth.landlord);
    console.log('Landlord:', landlord);
    const landlordId = landlord;
    const navigate = useNavigate();
    useEffect(() => {
        if (isSuccess && data && window.Razorpay) {
            const orderId = data?.result?.orderId;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_API_KEY,
                amount: 100 * 100,
                currency: "INR",
                name: "Fake Product",
                description: "Test transaction",
                order_id: orderId,
                handler: async function (response: any) {
                    await verifyPayment({
                        paymentId: response.razorpay_payment_id,
                        orderId: response.razorpay_order_id,
                        signature: response.razorpay_signature
                    });

                    await placeorder({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        name: "Fake Property",
                        price: 100,
                        landlord: landlordId,
                        paymentId: response.razorpay_payment_id,
                        orderId: response.razorpay_order_id,
                        signature: response.razorpay_signature,
                    });
                },
                prefill: {
                    name: landlord?.name,
                    email: landlord?.email,
                    contact: landlord?.mobile
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const razor = new window.Razorpay(options);
            razor.open();
        }
    }, [isSuccess, data, landlordId]);
    useEffect(() => {
        if (placeSuccess) {
            toast.success("Create Bill successfully!");
            navigate("/landlord/property");
        }
    }, [placeSuccess, navigate])
    useEffect(() => {
        if (verifySuccess) {
            console.log("Payment verified!");
            navigate('/landlord');
        }
    }, [verifySuccess]);
    return (
        <>
            {/* {
                placeSuccess
                    ? <Successful />
                    : <button
                        onClick={() => initiateOrder({ amount: 100 })}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                    >
                        Pay ₹100
                    </button>
            } */}

            <div className="flex justify-center items-center min-h-[300px] flex-col space-y-4">
                {placeSuccess ? (
                    <Successful />
                ) : (
                    <>
                        <p className="text-center text-red-600 font-medium">
                            You can only add 5 properties for free. Please upgrade. <br />
                            <span className="font-semibold">Pay ₹100</span>
                        </p>
                        <button
                            onClick={() => initiateOrder({ amount: 100 })}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                        >
                            Proceed to Payment
                        </button>
                    </>
                )}
            </div>

        </>
    );
};

const Successful = () => {
    return (
        <>
            <h1>Payment Successful!</h1>
            <button>Save</button>
        </>
    );
};

export default RezorPayment;

