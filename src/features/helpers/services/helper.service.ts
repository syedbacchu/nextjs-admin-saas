import { request } from '@/lib/http/request'
import {
    Helper,
    HelperListData,
    HelperListResponse,
    HelperMutationResponse,
    HelperSingleResponse,
    HelperVehicleCategoryListData,
    HelperVehicleCategoryListResponse,
} from '@/features/helpers'

export const HelperService = {
    list(tenantSlug: string, page: number = 1, search: string = ''): Promise<HelperListResponse> {
        return request<HelperListData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/helpers`,
            params: { page, search },
        })
    },

    show(tenantSlug: string, id: number | string): Promise<HelperSingleResponse> {
        return request<Helper>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/helpers/${id}`,
        })
    },

    create(tenantSlug: string, data: FormData): Promise<HelperMutationResponse> {
        return request<Helper>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/helpers`,
            data,
        })
    },

    update(tenantSlug: string, id: number | string, data: FormData): Promise<HelperMutationResponse> {
        return request<Helper>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/helpers/${id}`,
            data,
        })
    },

    delete(tenantSlug: string, id: number | string): Promise<HelperMutationResponse> {
        return request<unknown[]>({
            method: 'DELETE',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/helpers/${id}`,
        })
    },

    vehicleCategories(page: number = 1, search: string = ''): Promise<HelperVehicleCategoryListResponse> {
        return request<HelperVehicleCategoryListData>({
            method: 'GET',
            url: '/user/vehicle-categories',
            params: { page, search },
        })
    },
}
