import { ApiResponse } from '@/types/api'
import type { Employee } from '@/features/employees'

export interface Attendance {
    id: number
    added_by?: number | null
    updated_by?: number | null
    date: string
    employee_id: number
    employee: Employee
    working_day: number | string
    month: string
    status: number
    created_by_user?: number | null
    created_at?: string
    updated_at?: string
}

export interface AttendanceListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: Attendance[]
}

export interface AttendancePayload {
    date: string
    employee_id: number | string
    working_day: number | string
    month: string
    status: number | string
}

export type AttendanceListResponse = ApiResponse<AttendanceListData>
export type AttendanceSingleResponse = ApiResponse<Attendance>
export type AttendanceMutationResponse = ApiResponse<Attendance | unknown[]>
