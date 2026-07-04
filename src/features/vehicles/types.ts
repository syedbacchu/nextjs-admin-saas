import { ApiResponse } from '@/types/api'

export interface VehiclePersonSummary {
    id: number
    name: string
    mobile?: string | null
}

export interface VehicleCategorySummary {
    id: number
    name: string
    sizes?: VehicleSizeSummary[]
}

export interface VehicleSizeSummary {
    id: number
    vehicle_category_id?: number | null
    name: string
}

export interface VehicleRegistrationSummary {
    id: number
    name: string
}

export interface Vehicle {
    id: number
    date?: string | null
    vehicle_name?: string | null
    image?: string | null
    driver_id?: number | string | null
    driver_ids?: number[] | null
    driver?: VehiclePersonSummary | null
    drivers?: VehiclePersonSummary[] | null
    helper_id?: number | string | null
    helper_ids?: number[] | null
    helper?: VehiclePersonSummary | null
    helpers?: VehiclePersonSummary[] | null
    supervisor_ids?: number[] | null
    supervisors?: VehiclePersonSummary[] | null
    vehicle_category_id?: number | string | null
    vehicle_category?: VehicleCategorySummary | null
    vehicle_size_id?: number | string | null
    vehicle_size?: VehicleSizeSummary | null
    vehicle_kpl?: number | string | null
    fuel_capacity?: string | null
    registration_number?: string | null
    registration_no: string
    registration_serial_id?: number | string | null
    registration_serial?: VehicleRegistrationSummary | null
    registration_zone_id?: number | string | null
    registration_zone?: VehicleRegistrationSummary | null
    registration_expired_date?: string | null
    tax_expired_date?: string | null
    road_permit_expired_date?: string | null
    fitness_expired_date?: string | null
    insurance_expired_date?: string | null
    vehicle_type?: string | null
    brand: string
    model: string
    manufacturing_year: number | string
    color?: string | null
    notes?: string | null
    status: number
    driver_count?: number | null
    helper_count?: number | null
    supervisor_count?: number | null
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

export interface VehicleRegistrationListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: VehicleRegistrationSummary[]
}

export interface VehiclePayload {
    date?: string
    vehicle_name?: string
    driver_ids?: Array<string | number>
    helper_ids?: Array<string | number>
    supervisor_ids?: Array<string | number>
    vehicle_category_id?: string | number
    vehicle_size_id?: string | number
    vehicle_kpl?: string | number
    fuel_capacity?: string
    registration_no: string
    registration_serial_id?: string | number
    registration_zone_id?: string | number
    registration_expired_date?: string
    tax_expired_date?: string
    road_permit_expired_date?: string
    fitness_expired_date?: string
    insurance_expired_date?: string
    vehicle_type?: string
    brand: string
    model: string
    manufacturing_year: string | number
    color?: string
    notes?: string
    image?: string | null
    status: string | number
}

export type VehicleListResponse = ApiResponse<VehicleListData>
export type VehicleSingleResponse = ApiResponse<Vehicle>
export type VehicleMutationResponse = ApiResponse<Vehicle | unknown[]>
export type VehicleRegistrationListResponse = ApiResponse<VehicleRegistrationListData>
