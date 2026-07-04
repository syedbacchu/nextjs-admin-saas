import { ApiResponse } from '@/types/api'

export interface SupplierLedgerSupplier {
    id: number
    name: string
    mobile: string
    address?: string | null
    business_category?: string | null
    contact_person?: string | null
}

export interface SupplierLedgerItem {
    id: number
    supplier: SupplierLedgerSupplier
    fuel_purchases_count: number
    fuel_total_amount: number
    fuel_total_paid: number
    fuel_total_due: number
    maintenance_purchases_count: number
    maintenance_total_amount: number
    maintenance_total_paid: number
    maintenance_total_due: number
    official_product_purchases_count: number
    official_product_total_amount: number
    official_product_total_paid: number
    official_product_total_due: number
    total_purchases_count: number
    total_amount: number
    total_paid: number
    total_due: number
    payment_status: 'paid' | 'partial' | 'unpaid'
}

export interface SupplierLedgerListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: SupplierLedgerItem[]
}

export interface SupplierLedgerSummary {
    total_suppliers: number
    total_purchases: number
    total_amount: number
    total_paid: number
    total_due: number
    paid_suppliers: number
    partial_suppliers: number
    unpaid_suppliers: number
    fuel_purchases: number
    maintenance_purchases: number
    official_product_purchases: number
}

export type SupplierLedgerListResponse = ApiResponse<SupplierLedgerListData & { summary?: SupplierLedgerSummary }>
