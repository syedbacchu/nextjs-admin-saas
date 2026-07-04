export interface Driver {
    id: number
    name: string
    phone?: string
    vehicle_category_id?: number
}

export interface Office {
    id: number
    branch_name: string
}

export interface DriverPaymentSummary {
    driver_id: number
    driver: Driver | null
    office: Office | null
    trip_count: number
    total_commission: number
    advance_paid: number
    payment_received: number
    due_amount: number
    payment_status: 'paid' | 'partial' | 'unpaid'
}

export interface DriverPayment {
    id: number
    date: string | null
    driver_id: number
    amount: number
    payment_method: string
    note: string | null
    bill_ref: string | null
    bill_document: string | null
    status: number
    created_at: string | null
}

export interface CreateDriverPaymentRequest {
    driver_id: number
    office_id: number
    amount: number
    payment_method: string
    note?: string
    bill_document?: string
    bill_ref?: string
    date?: string
}

export interface DriverPaymentListResponse {
    data: DriverPaymentSummary[]
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    summary: {
        total_drivers: number
        total_trips: number
        total_commission: string
        total_advance: string
        total_payments: string
        total_received: string
        total_due: string
        paid_count: number
        partial_count: number
        unpaid_count: number
    }
}
