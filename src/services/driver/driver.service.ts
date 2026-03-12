import { request } from '@/lib/http/request'
import {
    Driver,
    DriverListData,
    DriverListResponse,
    DriverMutationResponse,
    DriverSingleResponse,
} from '@/services/driver/driver.types'

export const DriverService = {
    list(tenantSlug: string, page: number = 1, search: string = ''): Promise<DriverListResponse> {
        return request<DriverListData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/drivers`,
            params: { page, search },
        })
    },

    show(tenantSlug: string, id: number | string): Promise<DriverSingleResponse> {
        return request<Driver>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/drivers/${id}`,
        })
    },

    create(tenantSlug: string, data: FormData): Promise<DriverMutationResponse> {
        return request<Driver>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/drivers`,
            data,
        })
    },

    update(tenantSlug: string, id: number | string, data: FormData): Promise<DriverMutationResponse> {
        return request<Driver>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/drivers/${id}`,
            data,
        })
    },

    delete(tenantSlug: string, id: number | string): Promise<DriverMutationResponse> {
        return request<unknown[]>({
            method: 'DELETE',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/drivers/${id}`,
        })
    },
}
