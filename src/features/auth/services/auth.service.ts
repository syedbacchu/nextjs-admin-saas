import { request } from '@/lib/http/request'
import {
    AuthForgotPasswordResponse,
    AuthLoginData,
    AuthLoginResponse,
    AuthMeData,
    AuthMeResponse,
    AuthResetPasswordResponse,
} from '@/features/auth/types'
import {ProfileData, ProfileResponse} from "@/features/profile";

export const AuthService = {
    login(tenantSlug: string, formData: FormData): Promise<AuthLoginResponse> {
        return request<AuthLoginData>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/auth/login`,
            data: formData,
        })
    },
    //
    // me(token: string): Promise<AuthMeResponse> {
    //     return request<AuthMeData>({
    //         method: 'GET',
    //         url: '/admin/user/me',
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //         },
    //     })
    // },
    me(tenantSlug: string): Promise<ProfileResponse> {
        return request<ProfileData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/account/profile`,
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
