import { request } from '@/lib/http/request'
import {
    RentVehicle,
    RentVehicleListData,
    RentVehicleListResponse,
    RentVehicleMutationResponse,
    RentVehicleSingleResponse,
} from '@/features/rent-vehicles'

export const RentVehicleService = {
    list(tenantSlug: string, page: number = 1, search: string = ''): Promise<RentVehicleListResponse> {
        return request<RentVehicleListData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/rent-vehicles`,
            params: { page, search },
        })
    },

    show(tenantSlug: string, id: number | string): Promise<RentVehicleSingleResponse> {
        return request<RentVehicle>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/rent-vehicles/${id}`,
        })
    },

    create(tenantSlug: string, data: FormData): Promise<RentVehicleMutationResponse> {
        return request<RentVehicle>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/rent-vehicles`,
            data,
        })
    },

    update(tenantSlug: string, id: number | string, data: FormData): Promise<RentVehicleMutationResponse> {
        return request<RentVehicle>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/rent-vehicles/${id}`,
            data,
        })
    },

    delete(tenantSlug: string, id: number | string): Promise<RentVehicleMutationResponse> {
        return request<unknown[]>({
            method: 'DELETE',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/rent-vehicles/${id}`,
        })
    },
}
