import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../components/ui/input';
import { toast } from 'react-toastify';
import { Button } from '../components/ui/button';
import { useRegisterLandlordMutation } from '../redux/api/auth.api';
import { Link, useNavigate } from 'react-router-dom';


const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    mobile: z.string().min(10, 'Mobile number must be at least 10 digits'),
});

type LandlordRegisterForm = z.infer<typeof schema>;

const RegisterLandlord = () => {
    const [LandlordRegister, { isSuccess, isError, isLoading }] = useRegisterLandlordMutation();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LandlordRegisterForm>({ resolver: zodResolver(schema) });

    const onSubmit = async (data: LandlordRegisterForm) => {
        try {
            await LandlordRegister(data).unwrap();
        } catch (error) {
        }
    };

    useEffect(() => {
        if (isSuccess) {
            navigate("/landlord/login");
        }
    }, [isSuccess, navigate]);

    useEffect(() => {
        if (isError) {
            toast.error("Invalid OTP. Please try again.");
        }
    }, [isError]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold text-center mb-4">Landlord Registration</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Name</label>
                        <Input type="text" {...register('name')} placeholder="Enter your name" />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <Input type="email" {...register('email')} placeholder="Enter your email" />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Mobile</label>
                        <Input type="text" {...register('mobile')} placeholder="Enter your mobile number" />
                        {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile.message}</p>}
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? 'Registering...' : 'Register'}
                    </Button>
                    <p className="mt-4 text-sm text-center">
                        Already have an account? <Link to="/landlord/login" className="text-blue-600 underline">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegisterLandlord;
