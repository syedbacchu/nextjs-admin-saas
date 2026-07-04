import { request } from '@/lib/http/request'
import {
    FundTransfer,
    FundTransferListData,
    FundTransferListResponse,
    FundTransferMutationResponse,
    FundTransferSingleResponse,
} from '@/features/fund-transfers'

export const FundTransferService = {
    list(tenantSlug: string, page: number = 1, search: string = ''): Promise<FundTransferListResponse> {
        return request<FundTransferListData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/fund-transfers`,
            params: { page, search },
        })
    },

    show(tenantSlug: string, id: number | string): Promise<FundTransferSingleResponse> {
        return request<FundTransfer>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/fund-transfers/${id}`,
        })
    },

    create(tenantSlug: string, data: FormData): Promise<FundTransferMutationResponse> {
        return request<FundTransfer>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/fund-transfers`,
            data,
        })
    },

    update(tenantSlug: string, id: number | string, data: FormData): Promise<FundTransferMutationResponse> {
        return request<FundTransfer>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/fund-transfers/${id}`,
            data,
        })
    },

    delete(tenantSlug: string, id: number | string): Promise<FundTransferMutationResponse> {
        return request<unknown[]>({
            method: 'DELETE',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/fund-transfers/${id}`,
        })
    },
}
