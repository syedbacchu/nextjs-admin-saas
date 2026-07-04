import { request } from '@/lib/http/request'
import {
    Vehicle,
    VehicleListData,
    VehicleListResponse,
    VehicleMutationResponse,
    VehicleRegistrationListData,
    VehicleRegistrationListResponse,
    VehiclePayload,
    VehicleSingleResponse,
} from '@/features/vehicles'

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

    create(tenantSlug: string, data: VehiclePayload): Promise<VehicleMutationResponse> {
        return request<Vehicle>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/vehicles`,
            data,
        })
    },

    update(tenantSlug: string, id: number | string, data: VehiclePayload): Promise<VehicleMutationResponse> {
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

    registrationZones(page: number = 1, search: string = ''): Promise<VehicleRegistrationListResponse> {
        return request<VehicleRegistrationListData>({
            method: 'GET',
            url: '/user/registration-zones',
            params: { page, search },
        })
    },

    registrationSerials(page: number = 1, search: string = ''): Promise<VehicleRegistrationListResponse> {
        return request<VehicleRegistrationListData>({
            method: 'GET',
            url: '/user/registration-serials',
            params: { page, search },
        })
    },
}
