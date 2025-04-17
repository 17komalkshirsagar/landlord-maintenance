
// import { useSelector } from 'react-redux'
// import { Navigate } from 'react-router-dom'
// import { RootState } from '../redux/store'
// import { ReactNode } from 'react';

// const ProtectedRoute = ({ compo }: {  compo: ReactNode }) => {

//     const { user } = useSelector<RootState, any>(state => state.auth)
//     const { admin } = useSelector<RootState, any>(state => state.auth)
//     const { landlord } = useSelector<RootState, any>(state => state.auth)

//     if (!user) {
//         return <Navigate to="/user/login" replace />
//     }
//     if (!admin) {
//         return <Navigate to="/admin/login" replace />
//     }
//     if (!landlord) {
//         return <Navigate to="/landlord/login" replace />
//     }

//     return 

// }

// export default ProtectedRoute


import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { ReactNode } from "react";

interface ProtectedRouteProps {
    compo: ReactNode;
}

const ProtectedRoute = ({ compo }: ProtectedRouteProps) => {
    const { user } = useSelector((state: RootState) => state.auth);

    if (!user) {
        return <Navigate to="/user/login" />;
    }

    return <>{compo}</>;
};

export default ProtectedRoute;

