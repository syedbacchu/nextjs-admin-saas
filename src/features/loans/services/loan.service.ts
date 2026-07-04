import { request } from '@/lib/http/request'
import {
    Loan,
    LoanListData,
    LoanListResponse,
    LoanMutationResponse,
    LoanSingleResponse,
    LoanPaymentHistoryResponse,
    EmployeeLoanHistoryResponse
} from '@/features/loans'

export const LoanService = {
    list(tenantSlug: string, page: number = 1, search: string = '', filters?: {
        employee_id?: string
        office_id?: string
    }): Promise<LoanListResponse> {
        return request<LoanListData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/payroll-loans`,
            params: {
                page,
                search,
                ...(filters?.employee_id && { employee_id: filters.employee_id }),
                ...(filters?.office_id && { office_id: filters.office_id }),
            },
        })
    },

    show(tenantSlug: string, id: number | string): Promise<LoanSingleResponse> {
        return request<Loan>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/payroll-loans/${id}`,
        })
    },

    create(tenantSlug: string, data: FormData): Promise<LoanMutationResponse> {
        return request<Loan>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/payroll-loans`,
            data,
        })
    },

    update(tenantSlug: string, id: number | string, data: FormData): Promise<LoanMutationResponse> {
        return request<Loan>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/payroll-loans/${id}`,
            data,
        })
    },

    delete(tenantSlug: string, id: number | string): Promise<LoanMutationResponse> {
        return request<unknown[]>({
            method: 'DELETE',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/payroll-loans/${id}`,
        })
    },

    getPaymentHistory(tenantSlug: string, loanId: number | string): Promise<LoanPaymentHistoryResponse> {
        return request<any>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/payroll-loans/${loanId}/payment-history`,
        })
    },

    getEmployeeLoanHistory(tenantSlug: string, employeeId: number | string): Promise<EmployeeLoanHistoryResponse> {
        return request<any[]>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/payroll-loans/employee-history`,
            params: { employee_id: employeeId },
        })
    },
}
