import { request } from '@/lib/http/request'
import {
    Office,
    OfficeListData,
    OfficeListResponse,
    OfficeMutationResponse,
    OfficeSingleResponse,
} from '@/features/offices'

export const OfficeService = {
    list(tenantSlug: string, page: number = 1, search: string = ''): Promise<OfficeListResponse> {
        return request<OfficeListData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/offices`,
            params: { page, search },
        })
    },

    show(tenantSlug: string, id: number | string): Promise<OfficeSingleResponse> {
        return request<Office>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/offices/${id}`,
        })
    },

    create(tenantSlug: string, data: FormData): Promise<OfficeMutationResponse> {
        return request<Office>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/offices`,
            data,
        })
    },

    update(tenantSlug: string, id: number | string, data: FormData): Promise<OfficeMutationResponse> {
        return request<Office>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/offices/${id}`,
            data,
        })
    },

    delete(tenantSlug: string, id: number | string): Promise<OfficeMutationResponse> {
        return request<unknown[]>({
            method: 'DELETE',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/offices/${id}`,
        })
    },
}
