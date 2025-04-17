



import { useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLogoutLandlordMutation } from "../redux/api/auth.api";
import { useNavigate } from "react-router-dom";
const LogoutLandlord = () => {
    const navigate = useNavigate();
    const [landlordLogout, { isSuccess, isError, isLoading }] = useLogoutLandlordMutation();

    const handleLogout = async () => {
        await landlordLogout({});
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success("Logout successfully!");
            navigate("/landlord/login");
        }
    }, [isSuccess, navigate]);

    useEffect(() => {
        if (isError) {
            toast.error("Logout failed. Please try again.");
        }
    }, [isError]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
                <h2 className="text-xl font-semibold mb-4">Are you sure you want to logout?</h2>
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
                    disabled={isLoading}
                >
                    {isLoading ? "Logging out..." : "Logout"}
                </button>
            </div>
        </div>
    );
};

export default LogoutLandlord;
