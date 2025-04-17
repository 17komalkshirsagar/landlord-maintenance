import React, { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'

interface Props {
    compo: ReactNode
}

const AdminProtected = ({ compo }: Props) => {
    const admin = useSelector((state: RootState) => state.auth.admin)

    return admin ? compo : <Navigate to="/admin/login" />
}

export default AdminProtected
