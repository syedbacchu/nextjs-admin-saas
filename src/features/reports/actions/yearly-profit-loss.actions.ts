'use server'

import { YearlyProfitLossService } from '@/features/reports/services/yearly-profit-loss.service'

export async function getYearlyProfitLossAction(
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
) {
    try {
        return await YearlyProfitLossService.getReport(tenantSlug, params)
    } catch (error) {
        console.error('Error fetching yearly profit/loss report:', error)
        return {
            success: false,
            message: 'Failed to fetch yearly profit/loss report',
            data: undefined,
        }
    }
}
