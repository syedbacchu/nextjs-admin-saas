import { ApiResponse } from '@/types/api'
import type { Customer } from '@/features/customers/types'

export type RoutePricingCustomer = Customer

export interface RoutePricingVehicleSize {
    id: number
    vehicle_category_id?: number | null
    name: string
}

export interface RoutePricingVehicleCategory {
    id: number
    name: string
    sizes?: RoutePricingVehicleSize[]
}

export interface RoutePricingArea {
    id: number
    name: string
}

export interface RoutePricing {
    id: number
    customer_id: number | string
    customer?: RoutePricingCustomer | null
    vehicle_category_id: number | string
    vehicle_category?: RoutePricingVehicleCategory | null
    load_area_id: number | string
    load_point_id?: number | string | null
    load_area?: RoutePricingArea | null
    load_point?: RoutePricingArea | null
    unload_area_id: number | string
    unload_point_id?: number | string | null
    unload_area?: RoutePricingArea | null
    unload_point?: RoutePricingArea | null
    vehicle_size_id: number | string
    vehicle_size?: RoutePricingVehicleSize | null
    rate: string | number
    distance?: number | null
    status: number
    created_at?: string
    updated_at?: string
}

export interface RoutePricingListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: RoutePricing[]
}

export interface RoutePricingPayload {
    customer_id: string | number
    vehicle_category_id: string | number
    load_area_id: string | number
    unload_area_id: string | number
    vehicle_size_id: string | number
    rate: string | number
    distance?: string | number
    status: string | number
}

export interface RoutePricingCustomerListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: RoutePricingCustomer[]
}

export interface RoutePricingVehicleCategoryListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: RoutePricingVehicleCategory[]
}

export interface RoutePricingAreaListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: RoutePricingArea[]
}

export type RoutePricingListResponse = ApiResponse<RoutePricingListData>
export type RoutePricingSingleResponse = ApiResponse<RoutePricing>
export type RoutePricingMutationResponse = ApiResponse<RoutePricing | unknown[]>
export type RoutePricingCustomerListResponse = ApiResponse<RoutePricingCustomerListData>
export type RoutePricingVehicleCategoryListResponse = ApiResponse<RoutePricingVehicleCategoryListData>
export type RoutePricingAreaListResponse = ApiResponse<RoutePricingAreaListData>
