import { ApiResponse } from '@/types/api'

export interface PaymentReceiveCustomerSummary {
    id: number
    name: string
    mobile?: string | null
}

export interface PaymentReceiveOfficeSummary {
    id: number
    branch_name: string
}

export interface PaymentReceive {
    id: number
    date?: string | null
    customer_id?: number | string | null
    customer?: PaymentReceiveCustomerSummary | null
    office_id?: number | string | null
    branch_name?: string | null
    office?: PaymentReceiveOfficeSummary | null
    bill_ref?: string | null
    amount?: string | number | null
    cash_type?: string | null
    note?: string | null
    created_by?: string | null
    bill_document?: string | null
    status: number
    created_at?: string
    updated_at?: string
}

export interface PaymentReceiveListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: PaymentReceive[]
}

export interface PaymentReceivePayload {
    date: string
    customer_id: string | number
    office_id: string | number
    bill_ref: string
    amount: string | number
    cash_type: string
    note?: string
    created_by: string
    bill_document?: File | string
    status?: string | number
}

export type PaymentReceiveListResponse = ApiResponse<PaymentReceiveListData>
export type PaymentReceiveSingleResponse = ApiResponse<PaymentReceive>
export type PaymentReceiveMutationResponse = ApiResponse<PaymentReceive | unknown[]>
