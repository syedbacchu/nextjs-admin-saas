import { ApiResponse } from '@/types/api'

export interface DashboardTenant {
    id: number
    company_name: string
    company_username: string
}

export interface VehicleAlert {
    type: string
    expiry_date: string
    days_until_expiry: number
    days_overdue: number
    is_expired: boolean
    status: 'expired' | 'critical' | 'warning'
}

export interface VehicleWithAlerts {
    vehicle_id: number
    vehicle_name: string
    registration_no: string
    vehicle_type?: string | null
    brand?: string
    model?: string
    image?: string | null
    alerts: VehicleAlert[]
}

export interface VehicleAlertsData {
    alert_days: number
    total_alerts: number
    expired_count: number
    vehicles: VehicleWithAlerts[]
}

export interface MaintenanceServiceAlert {
    maintenance_id: number
    vehicle: {
        id: number
        name: string
        image?: string | null
        registration_no: string
    } | null
    supplier: {
        id: number
        name: string
    } | null
    category: string
    service_date: string
    next_service_date: string
    days_until_service: number
    is_overdue: boolean
    days_overdue: number
    status: 'overdue' | 'critical' | 'upcoming'
    items: Array<{
        total: number
        quantity: number
        item_name: string
        unit_price: number
    }>
    service_charge: number
}

export interface MaintenanceAlertsData {
    alert_days: number
    total_alerts: number
    overdue_count: number
    critical_count: number
    upcoming_count: number
    services: MaintenanceServiceAlert[]
}

export interface EntityCount {
    total: number
    active: number
}

export interface EntityCounts {
    vehicles: EntityCount
    customers: EntityCount
    drivers: EntityCount
    suppliers: EntityCount
    employees: EntityCount
    vendors: EntityCount
    helpers: EntityCount
    supervisors: EntityCount
    offices: EntityCount
    trips: EntityCount & {
        today: number
        this_month: number
    }
}

export interface SalaryExpenseBreakdown {
    total_salary_expense: number
    helper_salary_breakdown: {
        total_salary_payments: number
        total_bonus: number
        total_advance_salary: number
        total_loan_payments: number
        total_expenses: number
    }
    supervisor_salary_breakdown: {
        total_salary_payments: number
        total_bonus: number
        total_advance_salary: number
        total_loan_payments: number
        total_expenses: number
    }
    employee_salary_breakdown: {
        total_salary_payments: number
        total_bonus: number
        total_advance_salary: number
        total_loan_payments: number
        total_expenses: number
    }
}

export interface FinancialExpenses {
    driver_cost: number
    own_trip_fuel_cost: number
    own_trip_other_cost: number
    all_fuel_expense: number
    vendor_trip_cost: number
    vendor_demurrage_cost: number
    maintenance_cost: number
    official_product_cost: number
    all_purchase_cost: number
    salary_expense: number
    office_expense: number
    total_expense: number
    salary_expense_breakdown: SalaryExpenseBreakdown
}

export interface FinancialIncome {
    own_trip_income: number
    vendor_trip_income: number
    customer_demurrage_income: number
    total_income: number
}

export interface FinancialSummary {
    income: FinancialIncome
    expenses: FinancialExpenses
    summary: {
        net_profit: number
        total_due_amount: number
        customer_due_amount: number
        vendor_amount: number
        vendor_advance: number
        vendor_payment: number
        vendor_due_amount: number
        driver_amount: number
        driver_advance: number
        driver_payment: number
        driver_due_amount: number
    }
}

export interface DashboardSummaryData {
    tenant: DashboardTenant
    entity_counts: EntityCounts
    financial_summary: FinancialSummary
    vehicle_alerts: VehicleAlertsData
    maintenance_alerts: MaintenanceAlertsData
}

export type DashboardSummaryResponse = ApiResponse<DashboardSummaryData>

// Paginated alerts types
export interface VehicleAlertsPaginatedData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: VehicleWithAlerts[]
}

export type VehicleAlertsPaginatedResponse = ApiResponse<VehicleAlertsPaginatedData>

export interface MaintenanceAlertsPaginatedData {
    total_count: number
    total_page: number
    per_page: number
    current_page: number
    data: MaintenanceServiceAlert[]
    alert_days: number
    total_alerts: number
    overdue_count: number
    critical_count: number
    upcoming_count: number
}

export type MaintenanceAlertsPaginatedResponse = ApiResponse<MaintenanceAlertsPaginatedData>

// Legacy types for backward compatibility
export interface DashboardActiveSubscription {
    id: number
    tenant_id: number
    plan_id: number
    plan_pricing_id?: number
    status?: string
    starts_at?: string | null
    ends_at?: string | null
    grace_ends_at?: string | null
    canceled_at?: string | null
    auto_renew?: number
    created_at?: string
    updated_at?: string
}

export interface DashboardPackage {
    is_active: boolean
    active_subscription?: DashboardActiveSubscription | null
}

export interface DashboardPayments {
    total: number
    verified: number
    pending: number
    total_paid_amount: number
}

export interface DashboardFeatureSummary {
    total_features: number
    enabled_features: number
}

export interface DashboardData {
    tenant: DashboardTenant
    package: DashboardPackage
    payments: DashboardPayments
    feature_summary: DashboardFeatureSummary
}

export type DashboardResponse = ApiResponse<DashboardData>
