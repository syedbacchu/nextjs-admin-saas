import { request } from '@/lib/http/request'
import {
    Staff,
    StaffListData,
    StaffListResponse,
    StaffMutationResponse,
    StaffSingleResponse,
    StaffFeaturesData,
    StaffFeaturesResponse,
} from '@/features/staff'

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

    getStaffFeatures(tenantSlug: string, staffId: number | string): Promise<StaffFeaturesResponse> {
        return request<StaffFeaturesData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/account/staff/${staffId}/features`,
        })
    },

    updateStaffFeatures(tenantSlug: string, staffId: number | string, features: string[]): Promise<StaffMutationResponse> {
        return request<Staff>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/account/staff/${staffId}/features`,
            data: { features },
        })
    },

    getMyFeatures(tenantSlug: string): Promise<StaffFeaturesResponse> {
        return request<StaffFeaturesData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/account/my-features`,
        })
    },
}
