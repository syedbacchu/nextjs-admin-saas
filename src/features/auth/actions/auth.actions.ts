'use server'

import { cookies } from 'next/headers'
import { headers } from 'next/headers'
import {
    AuthForgotPasswordResponse,
    AuthLoginResponse,
    AuthResetPasswordResponse, AuthService,
    AuthUser,
} from '@/features/auth'
import { getStaffFeaturesAction } from '@/features/staff'

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

async function shouldUseSecureCookies(): Promise<boolean> {
    const headerStore = await headers()
    const forwardedProto = headerStore.get('x-forwarded-proto')

    if (forwardedProto) {
        return forwardedProto.split(',')[0].trim() === 'https'
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''
    if (appUrl) {
        return appUrl.startsWith('https://')
    }

    return process.env.NODE_ENV === 'production'
}

export async function getCurrentUserFromSession() {
    const cookieStore = await cookies()
    const tetant_slug = cookieStore.get('tetant_slug')?.value
    if (!tetant_slug) return null
    const res = await AuthService.me(tetant_slug)

    return extractAuthUser(res)
}

function isAuthUser(value: unknown): value is AuthUser {
    if (!value || typeof value !== 'object') return false

    const candidate = value as Partial<AuthUser>
    return typeof candidate.id === 'number' && typeof candidate.name === 'string'
}

function extractAuthUser(
    response: Awaited<ReturnType<typeof AuthService.me>>,
): AuthUser | null {
    if (!response?.success) return null

    const payload = response.data as unknown
    if (isAuthUser(payload)) return payload

    if (payload && typeof payload === 'object' && 'user' in payload) {
        const nestedUser = (payload as { user?: unknown }).user
        if (isAuthUser(nestedUser)) return nestedUser
    }

    return null
}

export async function loginAction(tenantSlug: string, formData: FormData): Promise<AuthLoginResponse> {
    const res = await AuthService.login(tenantSlug, formData)

    if (res.success === true && res.data?.access_token) {
        const cookieStore = await cookies()
        const secure = await shouldUseSecureCookies()
        const token = res.data.access_token as string
        const maxAge = getJwtMaxAgeSeconds(token) ?? 60 * 60 * 24 * 30
        const responseTenantSlug =
            typeof res.data?.tenant?.company_username === 'string' && res.data.tenant.company_username.trim()
                ? res.data.tenant.company_username.trim()
                : tenantSlug

        cookieStore.set('access_token', res.data.access_token, {
            httpOnly: true,
            secure,
            sameSite: 'lax',
            maxAge,
            path: '/',
        })

        cookieStore.set('tenant_slug', responseTenantSlug, {
            httpOnly: true,
            secure,
            sameSite: 'lax',
            maxAge,
            path: '/',
        })

        // Load staff features if user is a staff member
        if (res.data.user?.user_type === 'staff') {
            try {
                const staffFeatures = await getStaffFeaturesAction(responseTenantSlug, res.data.user.id)
                if (staffFeatures.success && staffFeatures.data) {
                    // Replace tenant features with staff-specific features
                    res.data.features = Object.entries(staffFeatures.data.staff_assignments || {})
                        .filter(([_, accessible]) => accessible)
                        .reduce((acc, [key]) => {
                            acc[key] = true
                            return acc
                        }, {} as Record<string, boolean>)
                }
            } catch (error) {
                console.error('Failed to load staff features:', error)
                // If staff features fail to load, default to no features
                res.data.features = {}
            }
        }
    }

    return res
}

export async function meAction() {
    return getCurrentUserFromSession()
}

export async function logoutAction() {
    const cookieStore = await cookies()
    cookieStore.delete('access_token')
    cookieStore.delete('tenant_slug')
}

export async function forgotPasswordAction(
    tenantSlug: string,
    formData: FormData,
): Promise<AuthForgotPasswordResponse> {
    return AuthService.forgotPassword(tenantSlug, formData)
}

export async function resetPasswordAction(
    tenantSlug: string,
    formData: FormData,
): Promise<AuthResetPasswordResponse> {
    return AuthService.resetPassword(tenantSlug, formData)
}
