export interface SalaryPayment {
    id: number
    payment_date: string
    salary_sheet_id: number
    employee_id: number
    salary_month: string
    total_payable: number
    payment_amount: number
    previous_paid: number
    remaining_due: number
    office_id: number
    payment_method: string
    transaction_id: string | null
    remarks: string | null
    attachment: string | null
    status: number
    salary_expense_id?: number | null
    salary_expense?: {
        id: number
        date: string
        category: string
        amount: number
    }
    created_by_user?: {
        id: number
        name: string
    }
    updated_by_user?: {
        id: number
        name: string
    }
    created_at: string
    updated_at: string
}

export interface PayableAmount {
    salary_sheet_id: number
    employee?: {
        id: number
        name: string
        mobile: string
        designation: string
    }
    total_payable: number
    total_paid: number
    due_amount: number
    can_pay: boolean
    max_payment_amount: number
    payment_status: string
    loans?: {
        id: number
        loan_amount: number
        paid_amount: number
        remaining_balance: number
        monthly_deduction: number
    }[]
}

export interface PaymentHistory {
    salary_sheet_id: number
    total_payable: number
    total_paid: number
    remaining_due: number
    payment_status: string
    payments: SalaryPayment[]
}

export interface EmployeePaymentHistory {
    employee: {
        id: number
        name: string
        mobile: string
        designation: string
    }
    month?: string
    salary_sheet?: {
        id: number
        net_payable: number
        paid_amount: number
        due_amount: number
        payment_status: string
    }
    total_paid_amount: number
    payments: SalaryPayment[]
}

export interface SalarySheet {
    id: number
    employee_id: number
    working_day: number
    designation: string | null
    basic_salary: number | string
    house_rent: number | string
    conveyance: number | string
    medical: number | string
    allowance: number | string
    extra_allowance: number | string
    gross_salary: number | string
    bonus: number | string
    total_earnings: number | string
    advance_deduction: number | string
    loan_deduction: number | string
    total_deduction: number | string
    net_payable: number | string
    paid_amount: number | string
    due_amount: number | string
    payment_status: string
    paid_date: string | null
    employee?: {
        id: number
        name: string
        mobile: string
        designation: string
        status: number
    }
}

export interface GeneratedSalary {
    id: number
    generate_date: string
    month: string
    generated_by?: number
    status: number
    generated_by_user?: {
        id: number
        name: string
    }
    created_by_user?: {
        id: number
        name: string
    }
    salary_sheet?: SalarySheet[]
    summary?: {
        total_employee: number
        grand_total_earnings: number
        grand_total_deduction: number
        grand_total_net_payable: number
    }
}

export interface GeneratedSalaryListData {
    data: GeneratedSalary[]
    current_page: number
    last_page: number
    per_page: number
    total: number
}

export interface GeneratedSalaryListResponse {
    success: boolean
    message: string
    data: GeneratedSalaryListData
}

export interface GeneratedSalarySingleResponse {
    success: boolean
    message: string
    data: GeneratedSalary
}

export interface PayableAmountResponse {
    success: boolean
    message: string
    data: PayableAmount
}

export interface PaymentHistoryResponse {
    success: boolean
    message: string
    data: PaymentHistory
}

export interface EmployeePaymentHistoryResponse {
    success: boolean
    message: string
    data: EmployeePaymentHistory
}

export interface SalaryPaymentMutationResponse {
    success: boolean
    message: string
    data: SalaryPayment
}

export interface CreateSalaryPaymentRequest {
    salary_sheet_id: number
    payment_amount: number
    payment_date?: string
    office_id: number
    payment_method?: string
    transaction_id?: string
    remarks?: string
    attachment?: string
    status?: number
}
