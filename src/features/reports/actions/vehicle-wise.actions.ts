'use server'


import {VehicleWiseService} from "@/features/reports/services/vehicle-wise.service";

export async function getVehicleWiseReportAction(
    tenantSlug: string,
    params?: {
        page?: number
        per_page?: number
        from_date?: string
        to_date?: string
        vehicle_id?: number
    }
) {
    try {
        return await VehicleWiseService.getReport(tenantSlug, params)
    } catch (error) {
        console.error('Error fetching vehicle-wise report:', error)
        return {
            success: false,
            message: 'Failed to fetch vehicle-wise report',
            data: undefined,
        }
    }
}
