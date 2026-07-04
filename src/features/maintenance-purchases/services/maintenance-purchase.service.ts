import { request } from '@/lib/http/request'
import {
    MaintenancePurchase,
    MaintenancePurchaseListData,
    MaintenancePurchaseListResponse,
    MaintenancePurchaseMutationResponse,
    MaintenancePurchaseSingleResponse,
} from '@/features/maintenance-purchases'

export const MaintenancePurchaseService = {
    list(tenantSlug: string, page: number = 1, search: string = '', filters?: {
        office_id?: string
        supplier_id?: string
        vehicle_id?: string
        category?: string
    }): Promise<MaintenancePurchaseListResponse> {
        return request<MaintenancePurchaseListData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/maintenance-purchases`,
            params: {
                page,
                search,
                ...(filters?.office_id && { office_id: filters.office_id }),
                ...(filters?.supplier_id && { supplier_id: filters.supplier_id }),
                ...(filters?.vehicle_id && { vehicle_id: filters.vehicle_id }),
                ...(filters?.category && { category: filters.category }),
            },
        })
    },

    show(tenantSlug: string, id: number | string): Promise<MaintenancePurchaseSingleResponse> {
        return request<MaintenancePurchase>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/maintenance-purchases/${id}`,
        })
    },

    create(tenantSlug: string, data: FormData): Promise<MaintenancePurchaseMutationResponse> {
        return request<MaintenancePurchase>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/maintenance-purchases`,
            data,
        })
    },

    update(tenantSlug: string, id: number | string, data: FormData): Promise<MaintenancePurchaseMutationResponse> {
        return request<MaintenancePurchase>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/maintenance-purchases/${id}`,
            data,
        })
    },

    delete(tenantSlug: string, id: number | string): Promise<MaintenancePurchaseMutationResponse> {
        return request<unknown[]>({
            method: 'DELETE',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/maintenance-purchases/${id}`,
        })
    },
}
