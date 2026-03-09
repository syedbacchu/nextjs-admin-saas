import { ApiResponse } from '@/types/api'

export interface Vehicle {
    id: number
    registration_no: string
    vehicle_type: string
    brand: string
    model: string
    manufacturing_year: number
    color?: string | null
    notes?: string | null
    status: number
    driver_count?: number | null
    created_at?: string
    updated_at?: string
}

export interface VehicleListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: Vehicle[]
}

export interface VehiclePayload {
    registration_no: string
    vehicle_type: string
    brand: string
    model: string
    manufacturing_year: string | number
    color?: string
    notes?: string
    status: string | number
}

export type VehicleListResponse = ApiResponse<VehicleListData>
export type VehicleSingleResponse = ApiResponse<Vehicle>
export type VehicleMutationResponse = ApiResponse<Vehicle | unknown[]>
