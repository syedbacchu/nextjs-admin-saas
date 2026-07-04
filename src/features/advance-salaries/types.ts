import { ApiResponse } from '@/types/api'
import type { Employee } from '@/features/employees'

export interface AdvanceSalary {
    id: number
    added_by?: number | null
    updated_by?: number | null
    date: string
    employee_id: number
    employee?: Employee
    advance_amount: string | number
    salary_month: string
    after_adjustment_amount?: string | number
    status: string | number
    created_by_user?: number | null
    created_at?: string
    updated_at?: string
}

export interface AdvanceSalaryListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: AdvanceSalary[]
}

export type AdvanceSalaryListResponse = ApiResponse<AdvanceSalaryListData>
export type AdvanceSalarySingleResponse = ApiResponse<AdvanceSalary>
export type AdvanceSalaryMutationResponse = ApiResponse<AdvanceSalary | unknown[]>
