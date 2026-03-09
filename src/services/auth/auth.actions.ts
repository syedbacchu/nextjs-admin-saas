'use server'

import { cookies } from 'next/headers'
import { AuthService } from '@/services/auth/auth.service'
import { AuthLoginResponse } from '@/services/auth/auth.types'

function getJwtMaxAgeSeconds(token: string): number | undefined {
    try {
        const parts = token.split('.')
        if (parts.length < 2) return undefined

        const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8')) as { exp?: number }
        if (!payload.exp || typeof payload.exp !== 'number') return undefined

        const nowInSeconds = Math.floor(Date.now() / 1000)
        const ttl = Math.floor(payload.exp - nowInSeconds)
        return ttl > 0 ? ttl : undefined
    } catch {
        return undefined
    }
}

export async function loginAction(tenantSlug: string, formData: FormData): Promise<AuthLoginResponse> {
    const res = await AuthService.login(tenantSlug, formData)

    if (res.success === true && res.data?.access_token) {
        const cookieStore = await cookies()
        const token = res.data.access_token as string
        const maxAge = getJwtMaxAgeSeconds(token) ?? 60 * 60 * 24 * 30
        const responseTenantSlug =
            typeof res.data?.tenant?.company_username === 'string' && res.data.tenant.company_username.trim()
                ? res.data.tenant.company_username.trim()
                : tenantSlug

        cookieStore.set('access_token', res.data.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge,
            path: '/',
        })

        cookieStore.set('tenant_slug', responseTenantSlug, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge,
            path: '/',
        })
    }

    return res
}

export async function meAction() {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value
    if (!token) return null

    const res = await AuthService.me(token)

    return res.success ? (res.data.user ?? null) : null
}

export async function logoutAction() {
    const cookieStore = await cookies()
    cookieStore.delete('access_token')
    cookieStore.delete('tenant_slug')
}
