import { ApiResponse } from '@/types/api'

export interface FuelPurchaseOfficeSummary {
    id: number
    branch_name: string
}

export interface FuelPurchaseSupplierSummary {
    id: number
    name: string
    mobile?: string | null
    business_category?: string | null
}

export interface FuelPurchaseVehicleSummary {
    id: number
    vehicle_name?: string | null
    registration_number?: string | null
    registration_no?: string | null
}

export interface FuelPurchase {
    id: number
    purchase_date?: string | null
    office_id?: number | string | null
    office?: FuelPurchaseOfficeSummary | null
    supplier_id?: number | string | null
    supplier?: FuelPurchaseSupplierSummary | null
    fuel_type?: string | null
    vehicle_id?: number | string | null
    vehicle?: FuelPurchaseVehicleSummary | null
    quantity?: string | number | null
    unit_price?: string | number | null
    total?: string | number | null
    bill_document?: string | null
    status: number
    trip_id?: number | string | null
    created_at?: string
    updated_at?: string
}

export interface FuelPurchaseListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: FuelPurchase[]
}

export interface FuelPurchasePayload {
    purchase_date: string
    office_id: string | number
    supplier_id: string | number
    fuel_type: string
    vehicle_id: string | number
    quantity: string | number
    unit_price: string | number
    total: string | number
    status: string | number
    trip_id?: string | number
}

export interface FuelLedgerSummary {
    total_purchase_quantity: number
    total_purchase_cost: number
    total_trip_fuel_quantity: number
    total_trip_fuel_cost: number
    total_running_km: number
    total_trips: number
    remaining_fuel_quantity: number
    remaining_fuel_cost: number
}

export interface FuelLedgerVehicleSummary {
    id: number
    vehicle_name?: string | null
    registration_number?: string | null
    registration_no?: string | null
}

export interface FuelLedgerDriverSummary {
    id: number
    name?: string | null
    phone?: string | null
}

export interface FuelLedgerItem {
    id: number
    date?: string | null
    vehicle_id?: number | string | null
    vehicle?: FuelLedgerVehicleSummary | null
    driver_id?: number | string | null
    driver?: FuelLedgerDriverSummary | null
    odometer_start_km?: string | number | null
    odometer_end_km?: string | number | null
    running_km?: string | number | null
    fuel_quantity_liter?: string | number | null
    fuel_cost_per_liter?: string | number | null
    fuel_cost?: string | number | null
    challan_no?: string | null
    status: number
    created_at?: string
    updated_at?: string
}

export interface FuelLedgerListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: FuelLedgerItem[]
    summary?: FuelLedgerSummary | null
}

export interface FuelLedgerListFilters {
    vehicle_id?: string
    from_date?: string
    to_date?: string
}

export type FuelLedgerListResponse = ApiResponse<FuelLedgerListData>


export type FuelPurchaseListResponse = ApiResponse<FuelPurchaseListData>
export type FuelPurchaseSingleResponse = ApiResponse<FuelPurchase>
export type FuelPurchaseMutationResponse = ApiResponse<FuelPurchase | unknown[]>
