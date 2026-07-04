import { request } from '@/lib/http/request'
import {
    PaymentReceive,
    PaymentReceiveListData,
    PaymentReceiveListResponse,
    PaymentReceiveMutationResponse,
    PaymentReceiveSingleResponse,
} from '@/features/payment-receives'

export const PaymentReceiveService = {
    list(tenantSlug: string, page: number = 1, search: string = ''): Promise<PaymentReceiveListResponse> {
        return request<PaymentReceiveListData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/payment-receives`,
            params: { page, search },
        })
    },

    show(tenantSlug: string, id: number | string): Promise<PaymentReceiveSingleResponse> {
        return request<PaymentReceive>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/payment-receives/${id}`,
        })
    },

    create(tenantSlug: string, data: FormData): Promise<PaymentReceiveMutationResponse> {
        return request<PaymentReceive>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/payment-receives`,
            data,
        })
    },

    update(tenantSlug: string, id: number | string, data: FormData): Promise<PaymentReceiveMutationResponse> {
        return request<PaymentReceive>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/payment-receives/${id}`,
            data,
        })
    },

    delete(tenantSlug: string, id: number | string): Promise<PaymentReceiveMutationResponse> {
        return request<unknown[]>({
            method: 'DELETE',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/payment-receives/${id}`,
        })
    },
}
