import { request } from '@/lib/http/request'
import {
    AuthForgotPasswordResponse,
    AuthLoginData,
    AuthLoginResponse,
    AuthMeData,
    AuthMeResponse,
    AuthResetPasswordResponse,
} from '@/services/auth/auth.types'

export const AuthService = {
    login(tenantSlug: string, formData: FormData): Promise<AuthLoginResponse> {
        return request<AuthLoginData>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/auth/login`,
            data: formData,
        })
    },

    me(token: string): Promise<AuthMeResponse> {
        return request<AuthMeData>({
            method: 'GET',
            url: '/admin/user/me',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    },

    forgotPassword(tenantSlug: string, formData: FormData): Promise<AuthForgotPasswordResponse> {
        return request<unknown[]>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/auth/forgot-password`,
            data: formData,
        })
    },

    resetPassword(tenantSlug: string, formData: FormData): Promise<AuthResetPasswordResponse> {
        return request<unknown[]>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/auth/reset-password`,
            data: formData,
        })
    },
}
