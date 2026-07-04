import { ApiResponse } from '@/types/api'

export interface Staff {
    id: number
    name: string
    username: string
    email?: string | null
    phone?: string | null
    image?: string | null
    language?: string | null
    address?: string | null
    status: number
    enable_login: number
    role_module?: number | null
    role_id?: number | null
    user_type?: string | null
    tenant_driver_id?: number | null
    created_at?: string
    updated_at?: string
}

export interface StaffListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: Staff[]
}

export interface StaffPayload {
    name: string
    username?: string
    email: string
    phone: string
    password?: string
    status: string | number
    enable_login: string | number
}

export type StaffListResponse = ApiResponse<StaffListData>
export type StaffSingleResponse = ApiResponse<Staff>
export type StaffMutationResponse = ApiResponse<Staff | unknown[]>

// Staff Feature Types
export interface StaffFeatureAssignment {
    feature_key: string
    is_accessible: boolean
}

export interface StaffFeaturesData {
    tenant_features: Record<string, boolean | number>
    staff_assignments: Record<string, boolean>
}

export type StaffFeaturesResponse = ApiResponse<StaffFeaturesData>
