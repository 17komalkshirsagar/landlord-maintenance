


import React, { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'

interface Props {
    compo: ReactNode
}

const LandlordProtected = ({ compo }: Props) => {
    const landlord = useSelector((state: RootState) => state.auth.landlord)

    return landlord ? compo : <Navigate to="/landlord/login" />
}

export default LandlordProtected
