import { request } from '@/lib/http/request'
import {
    Vendor,
    VendorListData,
    VendorListResponse,
    VendorMutationResponse,
    VendorSingleResponse,
    VendorVehicleCategoryListData,
    VendorVehicleCategoryListResponse,
} from '@/features/vendors'

export const VendorService = {
    list(tenantSlug: string, page: number = 1, search: string = ''): Promise<VendorListResponse> {
        return request<VendorListData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/vendors`,
            params: { page, search },
        })
    },

    show(tenantSlug: string, id: number | string): Promise<VendorSingleResponse> {
        return request<Vendor>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/vendors/${id}`,
        })
    },

    create(tenantSlug: string, data: FormData): Promise<VendorMutationResponse> {
        return request<Vendor>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/vendors`,
            data,
        })
    },

    update(tenantSlug: string, id: number | string, data: FormData): Promise<VendorMutationResponse> {
        return request<Vendor>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/vendors/${id}`,
            data,
        })
    },

    delete(tenantSlug: string, id: number | string): Promise<VendorMutationResponse> {
        return request<unknown[]>({
            method: 'DELETE',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/vendors/${id}`,
        })
    },

    vehicleCategories(page: number = 1, search: string = ''): Promise<VendorVehicleCategoryListResponse> {
        return request<VendorVehicleCategoryListData>({
            method: 'GET',
            url: '/user/vehicle-categories',
            params: { page, search },
        })
    },
}
