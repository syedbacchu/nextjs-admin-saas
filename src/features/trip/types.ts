import { ApiResponse } from '@/types/api'

export interface TripCustomerSummary {
    id: number
    name: string
    mobile?: string | null
}

export interface TripOfficeSummary {
    id: number
    branch_name: string
}

export interface TripAreaSummary {
    id: number
    name: string
    mobile?: string | null
}

export interface TripVendorSummary {
    id: number
    name: string
    mobile?: string | null
}

export interface TripVehicleSummary {
    id: number
    vehicle_name?: string | null
    registration_number?: string | null
    registration_no?: string | null
}

export interface TripDriverSummary {
    id: number
    name: string
    phone?: string | null
}

export interface TripHelperSummary {
    id: number
    name: string
    mobile?: string | null
}

export interface TripSupervisorSummary {
    id: number
    name: string
    mobile?: string | null
}

export interface TripVehicleCategorySummary {
    id: number
    name: string
}

export interface TripVehicleSizeSummary {
    id: number
    vehicle_category_id?: number | null
    name: string
}

export interface Trip {
    id: number
    added_by?: number | null
    updated_by?: number | null
    date?: string | null
    customer_id?: number | string | null
    customer?: TripCustomerSummary | null
    office_id?: number | string | null
    office?: TripOfficeSummary | null
    branch?: TripOfficeSummary | null
    load_area_id?: number | string | null
    load_point_id?: number | string | null
    load_area?: TripAreaSummary | null
    load_point?: TripAreaSummary | null
    unload_area_id?: number | string | null
    unload_point_id?: number | string | null
    unload_area?: TripAreaSummary | null
    unload_point?: TripAreaSummary | null
    trip_type?: string | null
    additional_unload_point?: string | null
    sender_name?: string | null
    product_details?: string | null
    transport_type?: string | null
    vendor_id?: number | string | null
    vendor?: TripVendorSummary | null
    vehicle_id?: number | string | null
    vehicle?: TripVehicleSummary | null
    rent_vehicle_id?: number | string | null
    rent_vehicle?: TripVehicleSummary | null
    vehicle_no?: string | null
    driver_name?: string | null
    driver_id?: number | string | null
    driver?: TripDriverSummary | null
    helper_id?: number | string | null
    helper?: TripHelperSummary | null
    supervisor_id?: number | string | null
    supervisor?: TripSupervisorSummary | null
    vehicle_category_id?: number | string | null
    vehicle_category?: TripVehicleCategorySummary | null
    vehicle_size_id?: number | string | null
    vehicle_size?: TripVehicleSizeSummary | null
    challan_no?: string | null
    total_rent_bill_amount?: string | number | null
    total_cost?: string | number | null
    profit?: string | number | null
    odometer_start_km?: string | number | null
    odometer_end_km?: string | number | null
    running_km?: string | number | null
    vehicle_kpl?: string | number | null
    fuel_quantity_liter?: string | number | null
    fuel_cost_per_liter?: string | number | null
    fuel_supplier_id?: number | string | null
    fuel_supplier?: { id: number; name: string; mobile?: string | null } | null
    fuel_type?: string | null
    demurrage_days?: string | number | null
    total_demurrage?: string | number | null
    demurrage_total_rent?: string | number | null
    vendor_demurrage_days?: string | number | null
    vendor_total_demurrage?: string | number | null
    vendor_rent?: string | number | null
    vendor_rent_demurrage_total?: string | number | null
    rent_advance?: string | number | null
    advance?: string | number | null
    due_amount?: string | number | null
    driver_advance?: string | number | null
    driver_commission_percent?: string | number | null
    driver_commission_amount?: string | number | null
    fuel_cost?: string | number | null
    labour_cost?: string | number | null
    toll_cost?: string | number | null
    ferry_cost?: string | number | null
    police_cost?: string | number | null
    chada_cost?: string | number | null
    parking_cost?: string | number | null
    challan_cost?: string | number | null
    food_cost?: string | number | null
    others_cost?: string | number | null
    night_guard?: string | number | null
    additional_load_cost?: string | number | null
    total_expense?: string | number | null
    remarks?: string | null
    status: number
    created_at?: string
    updated_at?: string
}

export interface TripListSummary {
    total_count: number
    total_rent: string | number
    total_fuel_cost?: string | number
    total_road_cost?: string | number
    total_driver_cost?: string | number
    total_vendor_cost?: string | number
    total_cost: string | number
    total_profit: string | number
}

export interface TripListFilters {
    status?: '' | '0' | '1'
    trip_type?: '' | 'single' | 'round'
    transport_type?: '' | 'own_transport' | 'vendor_transport'
    office_id?: string
    vehicle_id?: string
    rent_vehicle_id?: string
    vendor_id?: string
    customer_id?: string
    driver_id?: string
    from_date?: string
    to_date?: string
}

export interface TripListData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: Trip[]
    summary?: TripListSummary | null
}

export interface TripPayload {
    date: string
    customer_id: string | number
    office_id: string | number
    load_area_id: string | number
    unload_area_id: string | number
    trip_type?: string
    additional_unload_point?: string
    sender_name?: string
    product_details?: string
    transport_type: string
    vendor_id?: string | number
    vehicle_id?: string | number
    rent_vehicle_id?: string | number
    vehicle_no?: string
    driver_name?: string
    driver_id?: string | number
    helper_id?: string | number
    supervisor_id?: string | number
    vehicle_category_id?: string | number
    vehicle_size_id?: string | number
    challan_no?: string
    total_rent_bill_amount?: string | number
    odometer_start_km?: string | number
    odometer_end_km?: string | number
    running_km?: string | number
    vehicle_kpl?: string | number
    fuel_quantity_liter?: string | number
    fuel_cost_per_liter?: string | number
    demurrage_days?: string | number
    total_demurrage?: string | number
    demurrage_total_rent?: string | number
    vendor_demurrage_days?: string | number
    vendor_total_demurrage?: string | number
    vendor_rent?: string | number
    vendor_rent_demurrage_total?: string | number
    rent_advance?: string | number
    advance?: string | number
    due_amount?: string | number
    driver_advance?: string | number
    driver_commission_percent?: string | number
    driver_commission_amount?: string | number
    fuel_cost?: string | number
    labour_cost?: string | number
    toll_cost?: string | number
    ferry_cost?: string | number
    police_cost?: string | number
    chada_cost?: string | number
    parking_cost?: string | number
    challan_cost?: string | number
    food_cost?: string | number
    others_cost?: string | number
    night_guard?: string | number
    additional_load_cost?: string | number
    total_expense?: string | number
    remarks?: string
    status: string | number
}

export type TripListResponse = ApiResponse<TripListData>
export type TripSingleResponse = ApiResponse<Trip>
export type TripMutationResponse = ApiResponse<Trip | unknown[]>
