import { ApiResponse } from '@/types/api'

export interface Supplier {
    id: number
    name: string
    business_category?: string | null
    mobile: string
    address?: string | null
    opening_balance?: string | number | null
    contact_person?: string | null
    creation_type?: number | null
    status: number
    created_at?: string
    updated_at?: string
}

export interface SupplierListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: Supplier[]
}

export interface SupplierPayload {
    name: string
    business_category: string
    mobile: string
    address: string
    opening_balance?: string | number
    contact_person: string
    status: string | number
}

export type SupplierListResponse = ApiResponse<SupplierListData>
export type SupplierSingleResponse = ApiResponse<Supplier>
export type SupplierMutationResponse = ApiResponse<Supplier | unknown[]>
