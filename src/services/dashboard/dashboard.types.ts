import { ApiResponse } from '@/types/api'

export interface DashboardTenant {
    id: number
    company_name: string
    company_username: string
}

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
