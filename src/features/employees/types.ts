import { ApiResponse } from '@/types/api'

export interface Employee {
    id: number
    employee_type?: string
    name: string
    email?: string | null
    mobile: string
    gender?: string | null
    blood_group?: string | null
    birth_date?: string | null
    join_date?: string | null
    nid?: string | null
    designation?: string | null
    address?: string | null
    basic_salary?: string | number | null
    house_rent?: string | number | null
    medical?: string | number | null
    allowance?: string | number | null
    extra_allowance?: string | number | null
    conveyance?: string | number | null
    gross_salary?: string | number | null
    image?: string | null
    status: number
    created_at?: string
    updated_at?: string
}

export interface EmployeeListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: Employee[]
}

export interface EmployeePayload {
    name: string
    email?: string
    mobile: string
    gender?: string
    blood_group?: string
    birth_date?: string
    join_date?: string
    nid?: string
    designation?: string
    address?: string
    basic_salary?: string | number
    house_rent?: string | number
    medical?: string | number
    allowance?: string | number
    extra_allowance?: string | number
    conveyance?: string | number
    gross_salary?: string | number
    image?: string
    status: string | number
}

export type EmployeeListResponse = ApiResponse<EmployeeListData>
export type EmployeeSingleResponse = ApiResponse<Employee>
export type EmployeeMutationResponse = ApiResponse<Employee | unknown[]>
export type EmployeeAllResponse = ApiResponse<Employee[]>
