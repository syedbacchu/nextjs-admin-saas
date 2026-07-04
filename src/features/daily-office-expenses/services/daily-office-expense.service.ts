import { request } from '@/lib/http/request'
import {
    DailyOfficeExpense,
    DailyOfficeExpenseListData,
    DailyOfficeExpenseListResponse,
    DailyOfficeExpenseMutationResponse,
    DailyOfficeExpenseSingleResponse,
} from '../types'

export const DailyOfficeExpenseService = {
    list(tenantSlug: string, page: number = 1, search: string = '', filters?: {
        office_id?: string
        category?: string
    }): Promise<DailyOfficeExpenseListResponse> {
        return request<DailyOfficeExpenseListData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/daily-office-expenses`,
            params: {
                page,
                search,
                ...(filters?.office_id && { office_id: filters.office_id }),
                ...(filters?.category && { category: filters.category }),
            },
        })
    },

    show(tenantSlug: string, id: number | string): Promise<DailyOfficeExpenseSingleResponse> {
        return request<DailyOfficeExpense>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/daily-office-expenses/${id}`,
        })
    },

    create(tenantSlug: string, data: FormData): Promise<DailyOfficeExpenseMutationResponse> {
        return request<DailyOfficeExpense>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/daily-office-expenses`,
            data,
        })
    },

    update(tenantSlug: string, id: number | string, data: FormData): Promise<DailyOfficeExpenseMutationResponse> {
        return request<DailyOfficeExpense>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/daily-office-expenses/${id}`,
            data,
        })
    },

    delete(tenantSlug: string, id: number | string): Promise<DailyOfficeExpenseMutationResponse> {
        return request<unknown[]>({
            method: 'DELETE',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/daily-office-expenses/${id}`,
        })
    },
}
