import { ApiResponse } from '@/types/api'

export interface DriverVehicle {
    id: number
    registration_no?: string | null
    vehicle_type?: string | null
    brand?: string | null
    model?: string | null
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

export type DriverListResponse = ApiResponse<DriverListData>
export type DriverSingleResponse = ApiResponse<Driver>
export type DriverMutationResponse = ApiResponse<Driver | unknown[]>
