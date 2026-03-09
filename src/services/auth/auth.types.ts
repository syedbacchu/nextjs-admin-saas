import { ApiResponse } from '@/types/api'

export interface AuthUser {
    id: number
    name: string
    username: string
    email?: string | null
    phone?: string | null
    image?: string | null
    language?: string
    address?: string | null
    status?: number
    role_module?: number
}

export interface AuthTenant {
    id: number
    uuid?: string
    company_name?: string
    company_username?: string
    status?: string
}

export interface AuthLoginData {
    access_token: string
    token_type?: string
    user?: AuthUser
    tenant?: AuthTenant
    package?: unknown
    features?: Record<string, boolean>
}

export interface AuthMeData {
    user?: AuthUser
}

export type AuthLoginResponse = ApiResponse<AuthLoginData>
export type AuthMeResponse = ApiResponse<AuthMeData>
