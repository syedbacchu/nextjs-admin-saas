import { ApiResponse } from '@/types/api'

export interface VehicleWiseTripStats {
    total_trips: number
    total_rent_bill_amount: number
    total_rent_advance: number
    total_driver_commission: number
    total_running_km: number
    total_fuel_quantity_used: number
    total_fuel_cost_from_trips: number
}

export interface VehicleWiseTripExpenses {
    toll_cost: number
    police_cost: number
    labour_cost: number
    ferry_cost: number
    chada_cost: number
    parking_cost: number
    challan_cost: number
    food_cost: number
    others_cost: number
    night_guard: number
    additional_load_cost: number
    total_trip_expense: number
}

export interface VehicleWiseFuelSummary {
    total_fuel_purchased: number
    total_fuel_purchase_cost: number
    total_fuel_used_cost: number
    total_fuel_used: number
    remaining_fuel: number
    fuel_load: number
    average_kpl: number
}

export interface VehicleWiseOtherCosts {
    maintenance_cost: number
    driver_commission: number
    driver_payments: number
    driver_due_payments: number
}

export interface VehicleWiseHelperSalaryStats {
    total_salary_payments: number
    total_bonus: number
    total_advance_salary: number
    total_loan_payments: number
    total_helper_expenses: number
}

export interface VehicleWiseSupervisorSalaryStats {
    total_salary_payments: number
    total_bonus: number
    total_advance_salary: number
    total_loan_payments: number
    total_supervisor_expenses: number
}

export interface VehicleWiseFinancialSummary {
    total_income: number
    total_trip_other_cost: number
    total_fuel_cost: number
    total_maintenance_cost: number
    total_driver_commission: number
    total_helper_expenses: number
    total_supervisor_expenses: number
    total_expense: number
    net_profit: number
    cost_per_km: number
}

export interface VehicleWiseReportData {
    id: number
    vehicle_id: number
    vehicle_name: string
    registration_no: string
    vehicle_type: string | null
    brand: string | null
    model: string | null
    driver_id: number | null
    helper_id: number | null
    fuel_capacity: number
    vehicle_kpl: number
    trip_stats: VehicleWiseTripStats
    trip_expenses: VehicleWiseTripExpenses
    fuel_summary: VehicleWiseFuelSummary
    other_costs: VehicleWiseOtherCosts
    helper_salary_stats: VehicleWiseHelperSalaryStats
    supervisor_salary_stats: VehicleWiseSupervisorSalaryStats
    financial_summary: VehicleWiseFinancialSummary
}

export interface VehicleWiseTotalSummary {
    total_vehicles: number
    total_trips: number
    total_rent_bill_amount: number
    total_rent_advance: number
    total_driver_commission: number
    total_driver_advance: number
    total_driver_payments: number
    total_driver_due: number
    total_running_km: number
    total_fuel_purchased: number
    total_fuel_used: number
    total_fuel_cost: number
    total_fuel_purchase_cost: number
    total_maintenance_cost: number
    total_trip_other_cost: number
    total_helper_salary_payments: number
    total_helper_bonus: number
    total_helper_advance_salary: number
    total_helper_loan_payments: number
    total_helper_expenses: number
    total_supervisor_salary_payments: number
    total_supervisor_bonus: number
    total_supervisor_advance_salary: number
    total_supervisor_loan_payments: number
    total_supervisor_expenses: number
    total_income: number
    total_expense: number
    net_profit: number
    average_kpl: number
}

export interface VehicleWiseListData {
    data: VehicleWiseReportData[]
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    total_summary_data: VehicleWiseTotalSummary
}

export type VehicleWiseResponse = ApiResponse<VehicleWiseListData>
