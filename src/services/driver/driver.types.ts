import { ApiResponse } from '@/types/api'

export interface DriverVehicle {
    id: number
    registration_no?: string | null
    vehicle_type?: string | null
    brand?: string | null
    model?: string | null
}

export interface DriverLoginAccountSummary {
    user_id: number
    name: string
    username: string
    email?: string | null
    phone?: string | null
    enable_login?: number | null
    status?: number | null
}

export interface Driver {
    id: number
    vehicle_id: number | null
    name: string
    phone: string
    license_no: string
    nid_no?: string | null
    joining_date?: string | null
    address?: string | null
    notes?: string | null
    status: number
    has_login_account?: boolean | null
    login_enabled?: boolean | null
    login_account?: DriverLoginAccountSummary | null
    vehicle?: DriverVehicle | null
    created_at?: string
    updated_at?: string
}

export interface DriverListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: Driver[]
}

export interface DriverPayload {
    name: string
    phone: string
    license_no: string
    nid_no?: string
    joining_date?: string
    address?: string
    notes?: string
    status: string | number
}

export interface DriverLoginAccount {
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
}

export interface DriverLoginPayload {
    name: string
    username: string
    email: string
    phone: string
    password: string
    status: string | number
    enable_login: string | number
}

export type DriverListResponse = ApiResponse<DriverListData>
export type DriverSingleResponse = ApiResponse<Driver>
export type DriverMutationResponse = ApiResponse<Driver | unknown[]>
export type DriverCreateLoginResponse = ApiResponse<DriverLoginAccount>
