import { request } from '@/lib/http/request'
import {
    Staff,
    StaffListData,
    StaffListResponse,
    StaffMutationResponse,
    StaffSingleResponse,
} from '@/services/staff/staff.types'

export const StaffService = {
    list(tenantSlug: string, page: number = 1, search: string = ''): Promise<StaffListResponse> {
        return request<StaffListData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/account/staff`,
            params: { page, search },
        })
    },

    show(tenantSlug: string, id: number | string): Promise<StaffSingleResponse> {
        return request<Staff>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/account/staff/${id}`,
        })
    },

    create(tenantSlug: string, data: FormData): Promise<StaffMutationResponse> {
        return request<Staff>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/account/staff`,
            data,
        })
    },

    update(tenantSlug: string, id: number | string, data: FormData): Promise<StaffMutationResponse> {
        return request<Staff>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/account/staff/${id}`,
            data,
        })
    },

    delete(tenantSlug: string, id: number | string): Promise<StaffMutationResponse> {
        return request<unknown[]>({
            method: 'DELETE',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/account/staff/${id}`,
        })
    },
}
