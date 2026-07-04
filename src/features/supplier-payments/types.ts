export type PurchaseType = 'fuel' | 'maintenance' | 'official_product'

export type PaymentStatus = 'paid' | 'partial' | 'unpaid'

export interface Supplier {
    id: number
    name: string
    mobile?: string
}

export interface Office {
    id: number
    branch_name: string
}

export interface Vehicle {
    id: number
    vehicle_name?: string
    registration_no?: string
}

export interface Driver {
    id: number
    name: string
}

export interface BasePurchase {
    id: number | string
    type: PurchaseType
    purchase_date: string
    supplier: Supplier
    office: Office
    total_purchase_amount: number
    paid_amount: number
    due_amount: number
    payment_status: PaymentStatus
    status: number
    created_at: string
    _serial?: number
}

export interface FuelPurchase extends BasePurchase {
    type: 'fuel'
    vehicle: Vehicle
    fuel_type: string
}

export interface MaintenancePurchase extends BasePurchase {
    type: 'maintenance'
    vehicle?: Vehicle
    driver?: Driver
    category: string
}

export interface OfficialProductPurchase extends BasePurchase {
    type: 'official_product'
    driver?: Driver
    category: string
}

export type AnyPurchase = FuelPurchase | MaintenancePurchase | OfficialProductPurchase

export interface PurchasePaymentHistory {
    id: number
    type: PurchaseType
    purchase_id: number
    supplier_id: number
    supplier: Supplier
    amount: number
    payment_method: string
    note?: string
    attachment?: string
    payment_date: string
    status: number
    created_at: string
    updated_at?: string
}

export interface SupplierPaymentListResponse {
    data: AnyPurchase[]
    total_page: number
    per_page: number
    current_page: number
    summary?: {
        total_purchases: number
        total_amount: number
        total_paid: number
        total_due: number
        fuel_purchases: number
        maintenance_purchases: number
        official_product_purchases: number
        paid_count: number
        partial_count: number
        unpaid_count: number
    }
}

export interface CreatePaymentRequest {
    type: PurchaseType
    purchase_id: number
    amount: number
    payment_method: string
    note?: string
    attachment?: string
    payment_date?: string
}

export interface CreatePaymentResponse {
    payment_history: PurchasePaymentHistory
    new_paid_amount: number
    due_amount: number
    payment_status: PaymentStatus
}
