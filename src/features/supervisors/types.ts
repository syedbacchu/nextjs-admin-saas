import { ApiResponse } from '@/types/api'

export interface SupervisorVehicleCategory {
    id: number
    name: string
    image?: string | null
    status?: number
}

export interface SupervisorVehicleSummary {
    id: number
    registration_no?: string | null
    vehicle_name?: string | null
    vehicle_type?: string | null
    brand?: string | null
    model?: string | null
}

export interface Supervisor {
    id: number
    name: string
    mobile: string
    nid_no: string
    image?: string | null
    joining_date?: string | null
    address?: string | null
    vehicle_category_id?: number | string | null
    vehicle_category?: SupervisorVehicleCategory | null
    vehicle_ids?: number[] | null
    vehicles?: SupervisorVehicleSummary[] | null
    basic_salary?: string | number | null
    house_rent?: string | number | null
    medical?: string | number | null
    allowance?: string | number | null
    extra_allowance?: string | number | null
    conveyance?: string | number | null
    gross_salary?: string | number | null
    status: number
    created_at?: string
    updated_at?: string
}

export interface SupervisorListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: Supervisor[]
}

export interface SupervisorPayload {
    name: string
    mobile: string
    address: string
    status: string | number
    vehicle_category_id: string | number
    nid_no: string
    image?: string | null
    joining_date: string
    basic_salary?: string | number
    house_rent?: string | number
    medical?: string | number
    allowance?: string | number
    extra_allowance?: string | number
    conveyance?: string | number
    gross_salary?: string | number
}

export type SupervisorListResponse = ApiResponse<SupervisorListData>
export type SupervisorSingleResponse = ApiResponse<Supervisor>
export type SupervisorMutationResponse = ApiResponse<Supervisor | unknown[]>
