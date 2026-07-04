'use server'

import { DashboardService, DashboardResponse, DashboardSummaryResponse, VehicleAlertsPaginatedResponse, MaintenanceAlertsPaginatedResponse } from '@/features/dashboard'

export async function getDashboardAction(tenantSlug: string): Promise<DashboardResponse> {
    return DashboardService.details(tenantSlug)
}

export async function getDashboardSummaryAction(tenantSlug: string): Promise<DashboardSummaryResponse> {
    return DashboardService.summary(tenantSlug)
}

export async function getVehicleAlertsAction(tenantSlug: string, page: number = 1, perPage: number = 20): Promise<VehicleAlertsPaginatedResponse> {
    return DashboardService.vehicleAlerts(tenantSlug, page, perPage)
}

export async function getMaintenanceAlertsAction(tenantSlug: string, page: number = 1, perPage: number = 20): Promise<MaintenanceAlertsPaginatedResponse> {
    return DashboardService.maintenanceAlerts(tenantSlug, page, perPage)
}
