import { ApiResponse } from '@/types/api'
import type { Employee } from '@/features/employees'

export interface Loan {
    id: number
    added_by?: number | null
    updated_by?: number | null
    loan_date: string
    employee_id: number
    employee?: Employee
    loan_amount: string | number
    monthly_deduction: string | number
    after_adjustment_amount: string | number
    remaining_balance: string | number
    paid_amount: string | number
    status: string
    created_by_user?: { id: number; name: string } | null
    created_at?: string
    updated_at?: string
}

export interface LoanListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: Loan[]
}

export type LoanListResponse = ApiResponse<LoanListData>
export type LoanSingleResponse = ApiResponse<Loan>
export type LoanMutationResponse = ApiResponse<Loan | unknown[]>

export interface LoanPayment {
    id: number
    payment_date: string
    salary_month: string | null
    paid_amount: string
    remaining_balance_before: string
    remaining_balance_after: string
    payment_method: string
    remarks: string | null
}

export interface LoanDetails {
    id: number
    loan_amount: string
    monthly_deduction: string
    paid_amount: string
    remaining_balance: string
    status: string
    loan_date: string
}

export interface LoanPaymentHistoryData {
    loan: LoanDetails
    payments: LoanPayment[]
}

export interface EmployeeLoanInfo {
    id: number
    loan_date: string
    loan_amount: string
    monthly_deduction: string
    paid_amount: string
    remaining_balance: string
    status: string
    recent_payments: {
        payment_date: string
        salary_month: string | null
        paid_amount: string
        remaining_balance_after: string
    }[]
}

export type LoanPaymentHistoryResponse = ApiResponse<LoanPaymentHistoryData>
export type EmployeeLoanHistoryResponse = ApiResponse<EmployeeLoanInfo[]>
