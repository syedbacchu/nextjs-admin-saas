import { ApiResponse } from '@/types/api'

export interface HelperVehicleCategory {
    id: number
    name: string
    image?: string | null
    status?: number
}

export interface Helper {
    id: number
    name: string
    mobile: string
    image?: string | null
    address?: string | null
    vehicle_category_id?: number | string | null
    vehicle_category?: HelperVehicleCategory | null
    basic_salary?: string | number | null
    house_rent?: string | number | null
    medical?: string | number | null
    allowance?: string | number | null
    extra_allowance?: string | number | null
    conveyance?: string | number | null
    gross_salary?: string | number | null
    status: number
    created_at?: string
    updated_at?: string
}

export interface HelperListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: Helper[]
}

export interface HelperPayload {
    name: string
    mobile: string
    image?: string
    address: string
    vehicle_category_id: string | number
    basic_salary?: string | number
    house_rent?: string | number
    medical?: string | number
    allowance?: string | number
    extra_allowance?: string | number
    conveyance?: string | number
    gross_salary?: string | number
    status: string | number
}

export interface HelperVehicleCategoryListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: HelperVehicleCategory[]
}


export interface LoanDetail {
    id: number
    loan_amount: number
    paid_amount: number
    remaining_balance: number
    monthly_deduction: number
    status: string
}

export interface HelperLedger {
    id: number
    helper_id: number
    helper_name: string
    total_trips: number
    trip_profit: number
    salary_paid: number
    due_salary: number
    advance_salary: number
    loan_deduction: number
    active_loans: number
    loan_details: LoanDetail[]
    total_loan_amount: number
    total_loan_paid: number
    total_loan_remaining: number
    status: number
    created_at: string
    updated_at: string
}

export interface HelperLedgerSummary {
    total_helpers: number
    total_trips: number
    total_trip_profit: string
    total_salary_paid: string
    total_due_salary: string
    total_advance_salary: string
    total_loan_deduction: string
    total_active_loans: number
    total_loan_amount: string
    total_loan_paid: string
    total_loan_remaining: string
}

export interface HelperLedgerListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: HelperLedger[]
    summary: HelperLedgerSummary
}

export type HelperLedgerListResponse = ApiResponse<HelperLedgerListData>

export interface SupervisorLedger {
    id: number
    supervisor_id: number
    supervisor_name: string
    total_trips: number
    trip_profit: number
    salary_paid: number
    due_salary: number
    advance_salary: number
    loan_deduction: number
    active_loans: number
    loan_details: LoanDetail[]
    total_loan_amount: number
    total_loan_paid: number
    total_loan_remaining: number
    status: number
    created_at: string
    updated_at: string
}

export interface SupervisorLedgerSummary {
    total_supervisors: number
    total_trips: number
    total_trip_profit: string
    total_salary_paid: string
    total_due_salary: string
    total_advance_salary: string
    total_loan_deduction: string
    total_active_loans: number
    total_loan_amount: string
    total_loan_paid: string
    total_loan_remaining: string
}

export interface SupervisorLedgerListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: SupervisorLedger[]
    summary: SupervisorLedgerSummary
}

export type SupervisorLedgerListResponse = ApiResponse<SupervisorLedgerListData>

export interface EmployeeLedger {
    id: number
    employee_id: number
    employee_name: string
    gross_salary: number
    salary_paid: number
    due_salary: number
    advance_salary: number
    loan_deduction: number
    active_loans: number
    loan_details: LoanDetail[]
    total_loan_amount: number
    total_loan_paid: number
    total_loan_remaining: number
    status: number
    created_at: string
    updated_at: string
}

export interface EmployeeLedgerSummary {
    total_employees: number
    total_salary_paid: string
    total_due_salary: string
    total_advance_salary: string
    total_loan_deduction: string
    total_active_loans: number
    total_loan_amount: string
    total_loan_paid: string
    total_loan_remaining: string
}

export interface EmployeeLedgerListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: EmployeeLedger[]
    summary: EmployeeLedgerSummary
}

export type EmployeeLedgerListResponse = ApiResponse<EmployeeLedgerListData>


export type HelperListResponse = ApiResponse<HelperListData>
export type HelperSingleResponse = ApiResponse<Helper>
export type HelperMutationResponse = ApiResponse<Helper | unknown[]>
export type HelperVehicleCategoryListResponse = ApiResponse<HelperVehicleCategoryListData>
