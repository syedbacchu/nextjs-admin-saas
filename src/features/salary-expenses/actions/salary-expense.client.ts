'use client'

import {
    createSalaryExpenseAction,
    deleteSalaryExpenseAction,
    updateSalaryExpenseAction,
    calculatePayableAmountAction,
    SalaryExpenseMutationResponse,
    PayableAmountResponse
} from '@/features/salary-expenses'

export async function createSalaryExpenseClient(
    tenantSlug: string,
    formData: FormData,
): Promise<SalaryExpenseMutationResponse> {
    return createSalaryExpenseAction(tenantSlug, formData)
}

export async function updateSalaryExpenseClient(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<SalaryExpenseMutationResponse> {
    return updateSalaryExpenseAction(tenantSlug, id, formData)
}

export async function deleteSalaryExpenseClient(
    tenantSlug: string,
    id: number | string,
): Promise<SalaryExpenseMutationResponse> {
    return deleteSalaryExpenseAction(tenantSlug, id)
}

export async function calculatePayableAmountClient(
    tenantSlug: string,
    employeeId: number | string,
    salaryMonth: string,
): Promise<PayableAmountResponse> {
    return calculatePayableAmountAction(tenantSlug, employeeId, salaryMonth)
}
