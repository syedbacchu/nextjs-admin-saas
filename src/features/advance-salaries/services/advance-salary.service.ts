import { request } from '@/lib/http/request'
import {
    AdvanceSalary,
    AdvanceSalaryListData,
    AdvanceSalaryListResponse,
    AdvanceSalaryMutationResponse,
    AdvanceSalarySingleResponse,
} from '@/features/advance-salaries/types'

export const AdvanceSalaryService = {
    list(tenantSlug: string, page: number = 1, search: string = '', filters?: {
        employee_id?: string
        office_id?: string
        salary_month?: string
    }): Promise<AdvanceSalaryListResponse> {
        return request<AdvanceSalaryListData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/payroll-advance-salaries`,
            params: {
                page,
                search,
                ...(filters?.employee_id && { employee_id: filters.employee_id }),
                ...(filters?.office_id && { office_id: filters.office_id }),
                ...(filters?.salary_month && { salary_month: filters.salary_month }),
            },
        })
    },

    show(tenantSlug: string, id: number | string): Promise<AdvanceSalarySingleResponse> {
        return request<AdvanceSalary>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/payroll-advance-salaries/${id}`,
        })
    },

    create(tenantSlug: string, data: FormData): Promise<AdvanceSalaryMutationResponse> {
        return request<AdvanceSalary>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/payroll-advance-salaries`,
            data,
        })
    },

    update(tenantSlug: string, id: number | string, data: FormData): Promise<AdvanceSalaryMutationResponse> {
        return request<AdvanceSalary>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/payroll-advance-salaries/${id}`,
            data,
        })
    },

    delete(tenantSlug: string, id: number | string): Promise<AdvanceSalaryMutationResponse> {
        return request<unknown[]>({
            method: 'DELETE',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/payroll-advance-salaries/${id}`,
        })
    },
}
