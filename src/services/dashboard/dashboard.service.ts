import { request } from '@/lib/http/request'
import { DashboardData, DashboardResponse } from '@/services/dashboard/dashboard.types'

export const DashboardService = {
    details(tenantSlug: string): Promise<DashboardResponse> {
        return request<DashboardData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/account/dashboard`,
        })
    },
}
