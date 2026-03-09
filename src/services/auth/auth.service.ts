import { request } from '@/lib/http/request'
import { AuthLoginData, AuthLoginResponse, AuthMeData, AuthMeResponse } from '@/services/auth/auth.types'

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
}
