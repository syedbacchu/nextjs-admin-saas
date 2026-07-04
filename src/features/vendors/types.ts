import { ApiResponse } from '@/types/api'

export interface VendorVehicleCategory {
    id: number
    name: string
    image?: string | null
    status?: number
}

export interface Vendor {
    id: number
    name: string
    mobile: string
    date?: string | null
    vehicle_category_id?: number | string | null
    vehicle_category?: VendorVehicleCategory | null
    work_area?: string | null
    opening_balance?: string | number | null
    creation_type?: number | null
    status: number
    created_at?: string
    updated_at?: string
}

export interface VendorListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: Vendor[]
}

export interface VendorVehicleCategoryListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: VendorVehicleCategory[]
}

export type VendorListResponse = ApiResponse<VendorListData>
export type VendorSingleResponse = ApiResponse<Vendor>
export type VendorMutationResponse = ApiResponse<Vendor | unknown[]>
export type VendorVehicleCategoryListResponse = ApiResponse<VendorVehicleCategoryListData>
