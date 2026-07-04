import { ApiResponse } from '@/types/api'

export interface Office {
    id: number
    branch_name: string
    opening_balance?: string | number | null
    address?: string | null
    status: number
    created_at?: string
    updated_at?: string
}

export interface OfficeListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: Office[]
}

export interface OfficePayload {
    branch_name: string
    opening_balance?: string | number
    address?: string
    status: string | number
}

export type OfficeListResponse = ApiResponse<OfficeListData>
export type OfficeSingleResponse = ApiResponse<Office>
export type OfficeMutationResponse = ApiResponse<Office | unknown[]>
