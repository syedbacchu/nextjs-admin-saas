import { ApiResponse } from '@/types/api'

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
