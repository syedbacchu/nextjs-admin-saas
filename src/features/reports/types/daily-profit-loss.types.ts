import { ApiResponse } from '@/types/api'

export interface DailyProfitLossIncome {
    own_trip_income: number
    vendor_trip_income: number
    customer_demurrage_income: number
    total_income: number
}

export interface DailyProfitLossExpenses {
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
}

export interface DailyProfitLossSummary {
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

export interface DailyProfitLossData {
    id: string
    date: string
    date_name: string
    income: DailyProfitLossIncome
    expenses: DailyProfitLossExpenses
    summary: DailyProfitLossSummary
}

export interface DailyProfitLossListResponse {
    data: DailyProfitLossData[]
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    total_summary_data?: {
        income: DailyProfitLossIncome
        expenses: DailyProfitLossExpenses
        summary: DailyProfitLossSummary
    }
}

export type DailyProfitLossResponse = ApiResponse<DailyProfitLossListResponse>
