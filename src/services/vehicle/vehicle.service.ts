import { request } from '@/lib/http/request'
import {
    Vehicle,
    VehicleListData,
    VehicleListResponse,
    VehicleMutationResponse,
    VehicleSingleResponse,
} from '@/services/vehicle/vehicle.types'

export const VehicleService = {
    list(tenantSlug: string, page: number = 1, search: string = ''): Promise<VehicleListResponse> {
        return request<VehicleListData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/vehicles`,
            params: { page, search },
        })
    },

    show(tenantSlug: string, id: number | string): Promise<VehicleSingleResponse> {
        return request<Vehicle>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/vehicles/${id}`,
        })
    },

    create(tenantSlug: string, data: FormData): Promise<VehicleMutationResponse> {
        return request<Vehicle>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/vehicles`,
            data,
        })
    },

    update(tenantSlug: string, id: number | string, data: FormData): Promise<VehicleMutationResponse> {
        return request<Vehicle>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/vehicles/${id}`,
            data,
        })
    },

    delete(tenantSlug: string, id: number | string): Promise<VehicleMutationResponse> {
        return request<unknown[]>({
            method: 'DELETE',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/vehicles/${id}`,
        })
    },
}
