import { request } from '@/lib/http/request'
import {
    YearlyProfitLossListResponse,
    YearlyProfitLossResponse,
} from '@/features/reports/types/yearly-profit-loss.types'

export const YearlyProfitLossService = {
    getReport(
        tenantSlug: string,
        params?: {
            page?: number
            per_page?: number
            from_year?: string
            to_year?: string
            year?: string
            orderBy?: string
            orderColumn?: string
        }
    ): Promise<YearlyProfitLossResponse> {
        return request<YearlyProfitLossListResponse>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/reports/yearly-profit-loss`,
            params,
        })
    },
}
