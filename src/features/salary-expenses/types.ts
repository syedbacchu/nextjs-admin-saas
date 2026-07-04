import { ApiResponse } from '@/types/api'

export interface SalaryExpenseUserSummary {
    id: number
    name: string
    mobile?: string | null
    designation?: string | null
    status?: number | null
}

export interface SalaryExpenseOfficeSummary {
    id: number
    branch_name: string
}

export interface SalaryExpense {
    id: number
    date?: string | null
    salary_month?: string | null
    paid_to_user_id?: number | string | null
    paid_to_user?: SalaryExpenseUserSummary | null
    paid_to_user_type?: string | null
    category: string
    office_id?: number | string | null
    office?: SalaryExpenseOfficeSummary | null
    amount?: string | number | null
    remarks?: string | null
    attachment?: string | null
    status: number
    created_at?: string
    updated_at?: string
}

export interface SalaryExpenseListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: SalaryExpense[]
}

export interface SalaryExpensePayload {
    date: string
    salary_month?: string
    paid_to_user_id: string | number
    category: string
    office_id: string | number
    amount: string | number
    remarks?: string
    attachment?: string
    status: string | number
}

export type SalaryExpenseListResponse = ApiResponse<SalaryExpenseListData>
export type SalaryExpenseSingleResponse = ApiResponse<SalaryExpense>
export type SalaryExpenseMutationResponse = ApiResponse<SalaryExpense | unknown[]>

export interface PayableAmountCalculation {
    gross_salary: string
    advance_deduction: string
    loan_deduction: string
    loan_total_monthly: string
    loan_paid_this_month: string
    previous_month_due: string
    total_deductions: string
    payable_amount: string
    already_paid: string
    remaining_amount: string
    trip_profit: string
}

export type PayableAmountResponse = ApiResponse<PayableAmountCalculation>

