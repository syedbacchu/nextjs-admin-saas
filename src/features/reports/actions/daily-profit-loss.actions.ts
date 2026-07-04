'use server'


import {DailyProfitLossService} from "@/features/reports/services/daily-profit-loss.service";

export async function getDailyProfitLossAction(
    tenantSlug: string,
    params?: {
        page?: number
        from_date?: string
        to_date?: string
    }
) {
    try {
        return await DailyProfitLossService.getReport(tenantSlug, params)
    } catch (error) {
        console.error('Error fetching daily profit/loss report:', error)
        return {
            success: false,
            message: 'Failed to fetch daily profit/loss report',
            data: undefined,
        }
    }
}
