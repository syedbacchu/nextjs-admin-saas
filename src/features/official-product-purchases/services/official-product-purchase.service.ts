import { request } from '@/lib/http/request'
import {
    OfficialProductPurchase,
    OfficialProductPurchaseListData,
    OfficialProductPurchaseListResponse,
    OfficialProductPurchaseMutationResponse,
    OfficialProductPurchaseSingleResponse,
} from '@/features/official-product-purchases'

export const OfficialProductPurchaseService = {
    list(tenantSlug: string, page: number = 1, search: string = '', filters?: {
        office_id?: string
        supplier_id?: string
        category?: string
    }): Promise<OfficialProductPurchaseListResponse> {
        return request<OfficialProductPurchaseListData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/official-product-purchases`,
            params: {
                page,
                search,
                ...(filters?.office_id && { office_id: filters.office_id }),
                ...(filters?.supplier_id && { supplier_id: filters.supplier_id }),
                ...(filters?.category && { category: filters.category }),
            },
        })
    },

    show(tenantSlug: string, id: number | string): Promise<OfficialProductPurchaseSingleResponse> {
        return request<OfficialProductPurchase>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/official-product-purchases/${id}`,
        })
    },

    create(tenantSlug: string, data: FormData): Promise<OfficialProductPurchaseMutationResponse> {
        return request<OfficialProductPurchase>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/official-product-purchases`,
            data,
        })
    },

    update(
        tenantSlug: string,
        id: number | string,
        data: FormData,
    ): Promise<OfficialProductPurchaseMutationResponse> {
        return request<OfficialProductPurchase>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/official-product-purchases/${id}`,
            data,
        })
    },

    delete(tenantSlug: string, id: number | string): Promise<OfficialProductPurchaseMutationResponse> {
        return request<unknown[]>({
            method: 'DELETE',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/official-product-purchases/${id}`,
        })
    },
}
