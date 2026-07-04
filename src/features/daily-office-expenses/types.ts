import { ApiResponse } from '@/types/api'

export interface DailyOfficeExpenseOfficeSummary {
    id: number
    branch_name: string
}

export interface DailyOfficeExpense {
    id: number
    date?: string | null
    paid_to: string
    category: string
    office_id?: number | string | null
    office?: DailyOfficeExpenseOfficeSummary | null
    amount?: string | number | null
    remarks?: string | null
    attachment?: string | null
    status: number
    created_at?: string
    updated_at?: string
}

export interface DailyOfficeExpenseListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: DailyOfficeExpense[]
}

export interface DailyOfficeExpensePayload {
    date: string
    paid_to: string
    category: string
    office_id: string | number
    amount: string | number
    remarks?: string
    attachment?: string
    status: string | number
}

export type DailyOfficeExpenseListResponse = ApiResponse<DailyOfficeExpenseListData>
export type DailyOfficeExpenseSingleResponse = ApiResponse<DailyOfficeExpense>
export type DailyOfficeExpenseMutationResponse = ApiResponse<DailyOfficeExpense | unknown[]>
