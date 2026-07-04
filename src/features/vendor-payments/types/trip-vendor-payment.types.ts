export interface Vendor {
  id: number
  name: string
  mobile?: string
  creation_type?: number | null
}

export interface Office {
  id: number
  branch_name: string
}

export interface VendorPaymentSummary {
  vendor_id: number
  vendor: Vendor | null
  office: Office | null
  trip_count: number
  total_vendor_rent: number
  total_customer_rent: number
  profit_from_vendor: number
  advance_paid: number
  payment_received: number
  due_amount: number
  payment_status: 'paid' | 'partial' | 'unpaid'
}

export interface VendorPaymentHistory {
  id: number
  date: string | null
  vendor_id: number
  amount: number
  payment_method: string
  note: string | null
  bill_ref: string | null
  bill_document: string | null
  status: number
  created_at: string | null
}

export interface CreateVendorPaymentRequest {
  vendor_id: number
  office_id: number
  amount: number
  payment_method: string
  note?: string
  bill_document?: string
  bill_ref?: string
  date?: string
}

export interface VendorPaymentListResponse {
  data: VendorPaymentSummary[]
  total_count: number
  total_page: number
  per_page: number
  current_page: number
  summary: {
    total_vendors: number
    total_trips: number
    total_vendor_rent: string
    total_customer_rent: string
    total_profit: string
    total_advance: string
    total_payments: string
    total_received: string
    total_due: string
    paid_count: number
    partial_count: number
    unpaid_count: number
  }
}
