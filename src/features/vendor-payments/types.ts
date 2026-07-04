import { ApiResponse } from '@/types/api'

export interface VendorPaymentVendorSummary {
    id: number
    name: string
    mobile?: string | null
}

export interface VendorPaymentOfficeSummary {
    id: number
    branch_name: string
}

export interface VendorPayment {
    id: number
    date?: string | null
    vendor_id?: number | string | null
    vendor?: VendorPaymentVendorSummary | null
    office_id?: number | string | null
    branch_name?: string | null
    office?: VendorPaymentOfficeSummary | null
    bill_ref?: string | null
    amount?: string | number | null
    payment_method?: string | null
    note?: string | null
    bill_document?: string | null
    status: number
    created_at?: string
    updated_at?: string
}

export interface VendorPaymentListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: VendorPayment[]
}

export type VendorPaymentListResponse = ApiResponse<VendorPaymentListData>
export type VendorPaymentSingleResponse = ApiResponse<VendorPayment>
export type VendorPaymentMutationResponse = ApiResponse<VendorPayment | unknown[]>
