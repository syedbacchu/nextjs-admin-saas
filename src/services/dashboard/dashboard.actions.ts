'use server'

import { DashboardService } from '@/services/dashboard/dashboard.service'
import { DashboardResponse } from '@/services/dashboard/dashboard.types'

export async function getDashboardAction(tenantSlug: string): Promise<DashboardResponse> {
    return DashboardService.details(tenantSlug)
}
