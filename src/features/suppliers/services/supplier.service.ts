import { request } from '@/lib/http/request'
import {
    Supplier,
    SupplierListData,
    SupplierListResponse,
    SupplierMutationResponse,
    SupplierSingleResponse,
} from '@/features/suppliers'

export const SupplierService = {
    list(tenantSlug: string, page: number = 1, search: string = ''): Promise<SupplierListResponse> {
        return request<SupplierListData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/suppliers`,
            params: { page, search },
        })
    },

    show(tenantSlug: string, id: number | string): Promise<SupplierSingleResponse> {
        return request<Supplier>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/suppliers/${id}`,
        })
    },

    create(tenantSlug: string, data: FormData): Promise<SupplierMutationResponse> {
        return request<Supplier>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/suppliers`,
            data,
        })
    },

    update(tenantSlug: string, id: number | string, data: FormData): Promise<SupplierMutationResponse> {
        return request<Supplier>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/suppliers/${id}`,
            data,
        })
    },

    delete(tenantSlug: string, id: number | string): Promise<SupplierMutationResponse> {
        return request<unknown[]>({
            method: 'DELETE',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/suppliers/${id}`,
        })
    },
}
