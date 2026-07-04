import { request } from '@/lib/http/request'
import {
    DailyProfitLossListResponse,
    DailyProfitLossResponse,
} from '@/features/reports/types/daily-profit-loss.types'

export const DailyProfitLossService = {
    getReport(
        tenantSlug: string,
        params?: {
            page?: number
            from_date?: string
            to_date?: string
        }
    ): Promise<DailyProfitLossResponse> {
        return request<DailyProfitLossListResponse>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/reports/daily-profit-loss`,
            params,
        })
    },
}
