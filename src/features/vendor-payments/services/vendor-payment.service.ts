import { request } from '@/lib/http/request'
import {
    VendorPayment,
    VendorPaymentListData,
    VendorPaymentListResponse,
    VendorPaymentMutationResponse,
    VendorPaymentSingleResponse,
} from '@/features/vendor-payments'

export const VendorPaymentService = {
    list(tenantSlug: string, page: number = 1, search: string = ''): Promise<VendorPaymentListResponse> {
        return request<VendorPaymentListData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/vendor-payments`,
            params: { page, search },
        })
    },

    show(tenantSlug: string, id: number | string): Promise<VendorPaymentSingleResponse> {
        return request<VendorPayment>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/vendor-payments/${id}`,
        })
    },

    create(tenantSlug: string, data: FormData): Promise<VendorPaymentMutationResponse> {
        return request<VendorPayment>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/vendor-payments`,
            data,
        })
    },

    update(tenantSlug: string, id: number | string, data: FormData): Promise<VendorPaymentMutationResponse> {
        return request<VendorPayment>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/vendor-payments/${id}`,
            data,
        })
    },

    delete(tenantSlug: string, id: number | string): Promise<VendorPaymentMutationResponse> {
        return request<unknown[]>({
            method: 'DELETE',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/vendor-payments/${id}`,
        })
    },
}
