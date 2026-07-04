export interface Customer {
  id: number
  name: string
  mobile?: string
  email?: string
}

export interface Office {
  id: number
  branch_name: string
}

export interface CustomerPaymentSummary {
  customer_id: number
  customer: Customer | null
  office: Office | null
  trip_count: number
  total_rent: number
  advance_received: number
  payment_received: number
  due_amount: number
  payment_status: 'paid' | 'partial' | 'unpaid'
}

export interface CustomerPaymentReceive {
  id: number
  date: string | null
  customer_id: number
  amount: number
  cash_type: string
  note: string | null
  bill_ref: string | null
  bill_document: string | null
  status: number
  created_at: string | null
}

export interface CreateCustomerPaymentReceiveRequest {
  customer_id: number
  office_id: number
  amount: number
  cash_type: string
  note?: string
  bill_ref?: string
  bill_document?: string
  date?: string
}

export interface CustomerPaymentListResponse {
  data: CustomerPaymentSummary[]
  total_count: number
  total_page: number
  per_page: number
  current_page: number
  summary: {
    total_customers: number
    total_rent: string
    total_advance: string
    total_payments: string
    total_received: string
    total_due: string
  }
}
