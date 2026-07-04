import { ApiResponse } from '@/types/api'

export interface FundTransferOfficeSummary {
    id: number
    branch_name: string
}

export interface FundTransfer {
    id: number
    date?: string | null
    office_id?: number | string | null
    branch_name?: string | null
    office?: FundTransferOfficeSummary | null
    person_name?: string | null
    cash_type?: string | null
    amount?: string | number | null
    bank_name?: string | null
    purpose?: string | null
    status: number
    created_at?: string
    updated_at?: string
}

export interface FundTransferListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: FundTransfer[]
}

export interface FundTransferPayload {
    date: string
    office_id: string | number
    person_name: string
    cash_type: string
    amount: string | number
    bank_name?: string
    purpose?: string
    status?: string | number
}

export type FundTransferListResponse = ApiResponse<FundTransferListData>
export type FundTransferSingleResponse = ApiResponse<FundTransfer>
export type FundTransferMutationResponse = ApiResponse<FundTransfer | unknown[]>
