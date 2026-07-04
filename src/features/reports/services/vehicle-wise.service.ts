import { request } from '@/lib/http/request'
import {
    VehicleWiseListData,
    VehicleWiseResponse,
} from '@/features/reports/types/vehicle-wise.types'

export const VehicleWiseService = {
    getReport(
        tenantSlug: string,
        params?: {
            page?: number
            per_page?: number
            from_date?: string
            to_date?: string
            vehicle_id?: number
        }
    ): Promise<VehicleWiseResponse> {
        return request<VehicleWiseListData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/reports/vehicle-wise`,
            params,
        })
    },
}
