
import { useSelector } from 'react-redux'
// import { Navigate } from 'react-router-dom'
import { RootState } from '../redux/store'
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

const UserProtected = ({ compo }: { compo: ReactNode }) => {

    const { user } = useSelector<RootState, any>(state => state.auth)


    return user ? compo : <Navigate to="/login" />
    // if (!user) {
    //     return <Navigate to="/login" replace />
    // }

    // return roles.includes(user.role) ? <>{compo}</> : <Navigate to="/unauthorized" replace />;

}

export default UserProtected