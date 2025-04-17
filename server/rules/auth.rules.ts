import { validationRulesSchema } from "../utils/validator";

export const registerRules: validationRulesSchema = {
    name: { required: true },
    email: { required: true, email: true },
    mobile: {
        required: true, pattern: /^[6-9]\d{9}$/
    },

    profile: { required: false },

}

export const sendOTPRules: validationRulesSchema = {
    mobile: {
        required: true, pattern: /^[6-9]\d{9}$/
    },
}

export const verifyOTPRules: validationRulesSchema = {
    mobile: { required: true, },
    otp: { required: true }
}

export const signInRules: validationRulesSchema = {
    email: { required: false, email: true },
    mobile: { required: false }
}

export const forgotPasswordRules: validationRulesSchema = {
    email: { required: true, email: true },
}

export const resetPasswordRules: validationRulesSchema = {
    password: { required: true, min: 8, max: 16 },
    confirmPassword: { required: true },
}