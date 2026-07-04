import { request } from '@/lib/http/request'
import {
    Bonus,
    BonusListData,
    BonusListResponse,
    BonusMutationResponse,
    BonusSingleResponse,
} from '@/features/bonuses'

export const BonusService = {
    list(tenantSlug: string, page: number = 1, search: string = '', filters?: {
        employee_id?: string
        office_id?: string
        salary_month?: string
    }): Promise<BonusListResponse> {
        return request<BonusListData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/payroll-bonuses`,
            params: {
                page,
                search,
                ...(filters?.employee_id && { employee_id: filters.employee_id }),
                ...(filters?.office_id && { office_id: filters.office_id }),
                ...(filters?.salary_month && { salary_month: filters.salary_month }),
            },
        })
    },

    show(tenantSlug: string, id: number | string): Promise<BonusSingleResponse> {
        return request<Bonus>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/payroll-bonuses/${id}`,
        })
    },

    create(tenantSlug: string, data: FormData): Promise<BonusMutationResponse> {
        return request<Bonus>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/payroll-bonuses`,
            data,
        })
    },

    update(tenantSlug: string, id: number | string, data: FormData): Promise<BonusMutationResponse> {
        return request<Bonus>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/payroll-bonuses/${id}`,
            data,
        })
    },

    delete(tenantSlug: string, id: number | string): Promise<BonusMutationResponse> {
        return request<unknown[]>({
            method: 'DELETE',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/payroll-bonuses/${id}`,
        })
    },
}
