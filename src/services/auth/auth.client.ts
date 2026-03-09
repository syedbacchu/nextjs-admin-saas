'use client'

import { useAuthStore } from '@/stores/auth.store'
import { loginAction } from '@/services/auth/auth.actions'
import { AuthLoginResponse } from '@/services/auth/auth.types'

export async function loginClient(tenantSlug: string, formData: FormData): Promise<AuthLoginResponse> {
    const res = await loginAction(tenantSlug, formData)

    if (res.success && res.data?.user) {
        useAuthStore.getState().setUser(res.data.user)
    }

    return res
}
