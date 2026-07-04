import { ApiResponse } from '@/types/api'

export interface YearlyProfitLossIncome {
    own_trip_income: number
    vendor_trip_income: number
    customer_demurrage_income: number
    total_income: number
}

export interface SalaryExpenseBreakdown {
    total_salary_payments: number
    total_bonus: number
    total_advance_salary: number
    total_loan_payments: number
    total_expenses: number
}

export interface YearlyProfitLossExpenses {
    driver_cost: number
    own_trip_fuel_cost: number
    own_trip_other_cost: number
    all_fuel_expense: number
    vendor_trip_cost: number
    vendor_demurrage_cost: number
    maintenance_cost: number
    official_product_cost: number
    all_purchase_cost: number
    salary_expense: number
    office_expense: number
    total_expense: number
    salary_expense_breakdown?: {
        total_salary_expense: number
        helper_salary_breakdown: SalaryExpenseBreakdown
        supervisor_salary_breakdown: SalaryExpenseBreakdown
        employee_salary_breakdown: SalaryExpenseBreakdown
    }
}

export interface YearlyProfitLossSummary {
    net_profit: number
    total_due_amount: number
    customer_due_amount: number
    vendor_amount: number
    vendor_advance: number
    vendor_payment: number
    vendor_due_amount: number
    driver_amount: number
    driver_advance: number
    driver_payment: number
    driver_due_amount: number
}

export interface YearlyProfitLossData {
    id: string
    year: string
    year_name: string
    income: YearlyProfitLossIncome
    expenses: YearlyProfitLossExpenses
    summary: YearlyProfitLossSummary
}

export interface YearlyProfitLossListResponse {
    data: YearlyProfitLossData[]
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    total_summary_data?: {
        income: YearlyProfitLossIncome
        expenses: YearlyProfitLossExpenses
        summary: YearlyProfitLossSummary
    }
}

export type YearlyProfitLossResponse = ApiResponse<YearlyProfitLossListResponse>
