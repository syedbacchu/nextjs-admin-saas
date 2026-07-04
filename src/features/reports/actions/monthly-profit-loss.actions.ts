'use server'


import {MonthlyProfitLossService} from "@/features/reports/services/monthly-profit-loss.service";

export async function getMonthlyProfitLossAction(tenantSlug: string, params?: {
    page?: number
    month?: string
    from_month?: string
    to_month?: string
}) {
    try {
        return await MonthlyProfitLossService.getReport(tenantSlug, params)
    } catch (error) {
        console.error('Error fetching monthly profit/loss report:', error)
        return {
            success: false,
            message: 'Failed to fetch monthly profit/loss report',
            data: undefined,
        }
    }
}
