import { ApiResponse } from '@/types/api'

export interface MaintenancePurchaseOfficeSummary {
    id: number
    branch_name: string
}

export interface MaintenancePurchaseSupplierSummary {
    id: number
    name: string
    mobile?: string | null
    business_category?: string | null
}

export interface MaintenancePurchaseVehicleSummary {
    id: number
    vehicle_name?: string | null
    registration_number?: string | null
    registration_no?: string | null
}

export interface MaintenancePurchaseDriverSummary {
    id: number
    name: string
    phone?: string | null
}

export interface MaintenancePurchaseItem {
    item_name: string
    quantity: string | number
    unit_price: string | number
    total: string | number
}

export interface MaintenancePurchase {
    id: number
    purchase_date?: string | null
    office_id?: number | string | null
    office?: MaintenancePurchaseOfficeSummary | null
    supplier_id?: number | string | null
    supplier?: MaintenancePurchaseSupplierSummary | null
    vehicle_id?: number | string | null
    vehicle?: MaintenancePurchaseVehicleSummary | null
    driver_id?: number | string | null
    driver?: MaintenancePurchaseDriverSummary | null
    category?: string | null
    items?: MaintenancePurchaseItem[]
    service_charge?: string | number | null
    total_purchase_amount?: string | number | null
    service_date?: string | null
    next_service_date?: string | null
    document_renew_date?: string | null
    document_next_expire_date?: string | null
    remarks?: string | null
    bill_document?: string | null
    status: number
    created_at?: string
    updated_at?: string
}

export interface MaintenancePurchaseListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: MaintenancePurchase[]
}

export interface MaintenancePurchasePayload {
    purchase_date: string
    office_id: string | number
    supplier_id: string | number
    vehicle_id: string | number
    driver_id: string | number
    category: string
    service_charge: string | number
    total_purchase_amount: string | number
    service_date?: string
    next_service_date?: string
    document_renew_date?: string
    document_next_expire_date?: string
    remarks?: string
    bill_document?: File | string
    status?: string | number
    items: MaintenancePurchaseItem[]
}

export type MaintenancePurchaseListResponse = ApiResponse<MaintenancePurchaseListData>
export type MaintenancePurchaseSingleResponse = ApiResponse<MaintenancePurchase>
export type MaintenancePurchaseMutationResponse = ApiResponse<MaintenancePurchase | unknown[]>
