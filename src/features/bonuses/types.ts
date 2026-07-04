import { ApiResponse } from '@/types/api'
import type { Employee } from '@/features/employees'

export interface Bonus {
    id: number
    added_by?: number | null
    updated_by?: number | null
    date: string
    employee_id: number
    employee?: Employee
    bonus_amount: string | number
    salary_month: string
    status: string | number
    created_by_user?: number | null
    created_at?: string
    updated_at?: string
}

export interface BonusListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: Bonus[]
}

export type BonusListResponse = ApiResponse<BonusListData>
export type BonusSingleResponse = ApiResponse<Bonus>
export type BonusMutationResponse = ApiResponse<Bonus | unknown[]>
