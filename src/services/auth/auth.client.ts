'use client'

import { useAuthStore } from '@/stores/auth.store'
import {
    forgotPasswordAction,
    loginAction,
    resetPasswordAction,
} from '@/services/auth/auth.actions'
import {
    AuthForgotPasswordResponse,
    AuthLoginResponse,
    AuthResetPasswordResponse,
} from '@/services/auth/auth.types'

export async function loginClient(tenantSlug: string, formData: FormData): Promise<AuthLoginResponse> {
    const res = await loginAction(tenantSlug, formData)

    if (res.success && res.data?.user) {
        useAuthStore.getState().setUser(res.data.user)
    }

    return res
}

export async function forgotPasswordClient(
    tenantSlug: string,
    formData: FormData,
): Promise<AuthForgotPasswordResponse> {
    return forgotPasswordAction(tenantSlug, formData)
}

export async function resetPasswordClient(
    tenantSlug: string,
    formData: FormData,
): Promise<AuthResetPasswordResponse> {
    return resetPasswordAction(tenantSlug, formData)
}
