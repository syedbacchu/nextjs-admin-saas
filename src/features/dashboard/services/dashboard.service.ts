import { request } from '@/lib/http/request'
import { DashboardData, DashboardResponse, DashboardSummaryData, DashboardSummaryResponse, VehicleAlertsPaginatedResponse, MaintenanceAlertsPaginatedResponse } from '@/features/dashboard'

export const DashboardService = {
    details(tenantSlug: string): Promise<DashboardResponse> {
        return request<DashboardData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/account/dashboard`,
        })
    },

    summary(tenantSlug: string): Promise<DashboardSummaryResponse> {
        return request<DashboardSummaryData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/account/dashboard/summary`,
        })
    },

    vehicleAlerts(tenantSlug: string, page: number = 1, perPage: number = 20): Promise<VehicleAlertsPaginatedResponse> {
        return request({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/account/dashboard/vehicle-alerts?page=${page}&per_page=${perPage}`,
        })
    },

    maintenanceAlerts(tenantSlug: string, page: number = 1, perPage: number = 20): Promise<MaintenanceAlertsPaginatedResponse> {
        return request({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/account/dashboard/maintenance-alerts?page=${page}&per_page=${perPage}`,
        })
    },
}
