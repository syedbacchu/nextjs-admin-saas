import { request } from '@/lib/http/request'
import {
    SalaryExpense,
    SalaryExpenseListData,
    SalaryExpenseListResponse,
    SalaryExpenseMutationResponse,
    SalaryExpenseSingleResponse,
} from '@/features/salary-expenses/salary-expense.types'

export const SalaryExpenseService = {
    list(tenantSlug: string, page: number = 1, search: string = '', filters?: {
        employee_id?: string
        office_id?: string
        salary_month?: string
    }): Promise<SalaryExpenseListResponse> {
        return request<SalaryExpenseListData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/salary-expenses`,
            params: {
                page,
                search,
                ...(filters?.employee_id && { employee_id: filters.employee_id }),
                ...(filters?.office_id && { office_id: filters.office_id }),
                ...(filters?.salary_month && { salary_month: filters.salary_month }),
            },
        })
    },

    show(tenantSlug: string, id: number | string): Promise<SalaryExpenseSingleResponse> {
        return request<SalaryExpense>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/salary-expenses/${id}`,
        })
    },

    create(tenantSlug: string, data: FormData): Promise<SalaryExpenseMutationResponse> {
        return request<SalaryExpense>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/salary-expenses`,
            data,
        })
    },

    update(tenantSlug: string, id: number | string, data: FormData): Promise<SalaryExpenseMutationResponse> {
        return request<SalaryExpense>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/salary-expenses/${id}`,
            data,
        })
    },

    delete(tenantSlug: string, id: number | string): Promise<SalaryExpenseMutationResponse> {
        return request<unknown[]>({
            method: 'DELETE',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/salary-expenses/${id}`,
        })
    },

    calculatePayableAmount(
        tenantSlug: string,
        employeeId: number | string,
        salaryMonth: string,
    ): Promise<import('./salary-expense.types').PayableAmountResponse> {
        return request<import('./salary-expense.types').PayableAmountCalculation>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/salary-expenses/calculate-payable`,
            params: { employee_id: employeeId, salary_month: salaryMonth },
        })
    },
}
