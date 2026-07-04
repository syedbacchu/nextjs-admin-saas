import { request } from '@/lib/http/request'
import {
    FuelPurchase,
    FuelPurchaseListData,
    FuelPurchaseListResponse,
    FuelPurchaseMutationResponse,
    FuelPurchaseSingleResponse,
} from "@/features/fuel-purchases"

export const FuelPurchaseService = {
    list(tenantSlug: string, page: number = 1, search: string = '', filters?: {
        office_id?: string
        supplier_id?: string
        vehicle_id?: string
        fuel_type?: string
    }): Promise<FuelPurchaseListResponse> {
        return request<FuelPurchaseListData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/fuel-purchases`,
            params: {
                page,
                search,
                ...(filters?.office_id && { office_id: filters.office_id }),
                ...(filters?.supplier_id && { supplier_id: filters.supplier_id }),
                ...(filters?.vehicle_id && { vehicle_id: filters.vehicle_id }),
                ...(filters?.fuel_type && { fuel_type: filters.fuel_type }),
            },
        })
    },

    show(tenantSlug: string, id: number | string): Promise<FuelPurchaseSingleResponse> {
        return request<FuelPurchase>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/fuel-purchases/${id}`,
        })
    },

    create(tenantSlug: string, data: FormData): Promise<FuelPurchaseMutationResponse> {
        return request<FuelPurchase>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/fuel-purchases`,
            data,
        })
    },

    update(tenantSlug: string, id: number | string, data: FormData): Promise<FuelPurchaseMutationResponse> {
        return request<FuelPurchase>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/fuel-purchases/${id}`,
            data,
        })
    },

    delete(tenantSlug: string, id: number | string): Promise<FuelPurchaseMutationResponse> {
        return request<unknown[]>({
            method: 'DELETE',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/fuel-purchases/${id}`,
        })
    },
}
