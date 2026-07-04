import { ApiResponse } from '@/types/api'

export interface OfficialProductPurchaseOfficeSummary {
    id: number
    branch_name: string
}

export interface OfficialProductPurchaseSupplierSummary {
    id: number
    name: string
    mobile?: string | null
    business_category?: string | null
}

export interface OfficialProductPurchaseDriverSummary {
    id: number
    name: string
    phone?: string | null
}

export interface OfficialProductPurchaseItem {
    item_name: string
    quantity: string | number
    unit_price: string | number
    total: string | number
}

export interface OfficialProductPurchase {
    id: number
    purchase_date?: string | null
    category?: string | null
    office_id?: number | string | null
    office?: OfficialProductPurchaseOfficeSummary | null
    supplier_id?: number | string | null
    supplier?: OfficialProductPurchaseSupplierSummary | null
    driver_id?: number | string | null
    driver?: OfficialProductPurchaseDriverSummary | null
    items?: OfficialProductPurchaseItem[]
    service_charge?: string | number | null
    total_purchase_amount?: string | number | null
    remarks?: string | null
    priority?: string | null
    bill_document?: string | null
    status: number
    created_at?: string
    updated_at?: string
}

export interface OfficialProductPurchaseListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: OfficialProductPurchase[]
}

export interface OfficialProductPurchasePayload {
    purchase_date: string
    category: string
    office_id: string | number
    supplier_id: string | number
    driver_id?: string | number
    service_charge: string | number
    total_purchase_amount: string | number
    remarks?: string
    priority?: string
    bill_document?: File | string
    status?: string | number
    items: OfficialProductPurchaseItem[]
}

export type OfficialProductPurchaseListResponse = ApiResponse<OfficialProductPurchaseListData>
export type OfficialProductPurchaseSingleResponse = ApiResponse<OfficialProductPurchase>
export type OfficialProductPurchaseMutationResponse = ApiResponse<OfficialProductPurchase | unknown[]>
