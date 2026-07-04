import { ApiResponse } from '@/types/api'

export interface SubscriptionDetails {
    id: number
    tenant_id: number
    plan_id: number
    plan_name?: string | null
    status?: string
    starts_at?: string | null
    ends_at?: string | null
    grace_ends_at?: string | null
    auto_renew?: number
    pricing?: unknown
}

export interface SubscriptionPaymentSummary {
    paid_amount: number
    due_amount: number
    currency: string
}

export interface SubscriptionDetailsData {
    package_active: boolean
    subscription?: SubscriptionDetails | null
    payment_summary?: SubscriptionPaymentSummary | null
    features?: Record<string, boolean>
}

export type SubscriptionDetailsResponse = ApiResponse<SubscriptionDetailsData>
