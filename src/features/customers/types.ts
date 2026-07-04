import { ApiResponse } from '@/types/api'

export interface Customer {
    id: number
    name: string
    mobile: string
    email?: string | null
    image?: string | null
    address?: CustomerAddressItem[] | string | null
    rate_status?: string | null
    opening_balance?: string | number | null
    creation_type?: number | null
    status: number
    created_at?: string
    updated_at?: string
}

export interface CustomerAddressItem {
    id?: number | null
    name: string
    address: string
    status?: number | null
}

export interface CustomerListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: Customer[]
}

export interface CustomerPayload {
    name: string
    mobile: string
    email?: string
    image?: string | null
    address: Array<Pick<CustomerAddressItem, 'name' | 'address'>>
    rate_status: string
    opening_balance?: string | number
    status: string | number
}

export interface CustomerAddressPayload {
    name?: string
    address: string
    status?: number
}

export type CustomerListResponse = ApiResponse<CustomerListData>
export type CustomerSingleResponse = ApiResponse<Customer>
export type CustomerMutationResponse = ApiResponse<Customer | unknown[]>
export type CustomerAddressMutationResponse = ApiResponse<CustomerAddressItem>
