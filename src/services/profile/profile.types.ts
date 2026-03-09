import { ApiResponse } from '@/types/api'

export interface ProfileUser {
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

export interface ProfileTenant {
    id: number
    company_name: string
    company_username: string
    status?: string
}

export interface ProfileData {
    user: ProfileUser
    tenant: ProfileTenant
}

export type ProfileResponse = ApiResponse<ProfileData>
export type UpdateProfileResponse = ApiResponse<ProfileUser>
export type ChangePasswordResponse = ApiResponse<unknown[]>
