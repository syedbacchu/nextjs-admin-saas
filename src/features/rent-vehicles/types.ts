import { ApiResponse } from '@/types/api'

export interface RentVehiclePartySummary {
    id: number
    name: string
    mobile?: string | null
}

export interface RentVehicleVendorDriverSummary {
    type?: string | null
    id: number
    name: string
}

export interface RentVehicleVehicleSize {
    id: number
    vehicle_category_id?: number | null
    name: string
}

export interface RentVehicleVehicleCategory {
    id: number
    name: string
    sizes?: RentVehicleVehicleSize[]
}

export interface RentVehicleRegistrationSummary {
    id: number
    name: string
}

export interface RentVehicle {
    id: number
    vehicle_name: string
    vendor_id?: number | string | null
    vendor?: RentVehiclePartySummary | null
    driver_name?: string | null
    driver_id?: number | string | null
    driver?: RentVehiclePartySummary | null
    vendor_driver?: RentVehicleVendorDriverSummary | null
    vehicle_category_id?: number | string | null
    vehicle_category?: RentVehicleVehicleCategory | null
    vehicle_size_id?: number | string | null
    vehicle_size?: RentVehicleVehicleSize | null
    registration_number: string
    registration_serial_id?: number | string | null
    registration_serial?: RentVehicleRegistrationSummary | null
    registration_zone_id?: number | string | null
    registration_zone?: RentVehicleRegistrationSummary | null
    status: number
    created_at?: string
    updated_at?: string
}

export interface RentVehicleListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: RentVehicle[]
}

export interface RentVehiclePayload {
    vehicle_name: string
    vendor_id: string | number
    driver_name: string
    vehicle_category_id: string | number
    vehicle_size_id: string | number
    registration_number: string
    registration_serial_id: string | number
    registration_zone_id: string | number
    status: string | number
}

export type RentVehicleListResponse = ApiResponse<RentVehicleListData>
export type RentVehicleSingleResponse = ApiResponse<RentVehicle>
export type RentVehicleMutationResponse = ApiResponse<RentVehicle | unknown[]>
