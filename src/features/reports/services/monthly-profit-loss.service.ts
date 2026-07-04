import { request } from '@/lib/http/request'
import {
    MonthlyProfitLossListResponse,
    MonthlyProfitLossResponse,
} from '@/features/reports/types/monthly-profit-loss.types'

export const MonthlyProfitLossService = {
    getReport(tenantSlug: string, params?: {
        page?: number
        month?: string
        from_month?: string
        to_month?: string
    }): Promise<MonthlyProfitLossResponse> {
        return request<MonthlyProfitLossListResponse>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/reports/monthly-profit-loss`,
            params: {
                page: params?.page?.toString() || '1',
                ...(params?.month ? { month: params.month } : {}),
                ...(params?.from_month ? { from_month: params.from_month } : {}),
                ...(params?.to_month ? { to_month: params.to_month } : {}),
            },
        })
    },
}
