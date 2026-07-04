'use server'

import { revalidatePath } from 'next/cache'
import {
    SalaryExpenseService,
    SalaryExpenseListResponse,
    SalaryExpenseMutationResponse,
    SalaryExpenseSingleResponse,
    PayableAmountResponse,
} from '@/features/salary-expenses'

export async function getSalaryExpensesAction(
    tenantSlug: string,
    page: number,
    search: string,
    filters?: {
        employee_id?: string
        office_id?: string
        salary_month?: string
    },
): Promise<SalaryExpenseListResponse> {
    return SalaryExpenseService.list(tenantSlug, page, search, filters)
}

export async function getSalaryExpenseAction(
    tenantSlug: string,
    id: number | string,
): Promise<SalaryExpenseSingleResponse> {
    return SalaryExpenseService.show(tenantSlug, id)
}

export async function createSalaryExpenseAction(
    tenantSlug: string,
    formData: FormData,
): Promise<SalaryExpenseMutationResponse> {
    const res = await SalaryExpenseService.create(tenantSlug, formData)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/salary-expenses`)
    }
    return res
}

export async function updateSalaryExpenseAction(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<SalaryExpenseMutationResponse> {
    const res = await SalaryExpenseService.update(tenantSlug, id, formData)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/salary-expenses`)
        revalidatePath(`/${tenantSlug}/salary-expenses/${id}`)
    }
    return res
}

export async function deleteSalaryExpenseAction(
    tenantSlug: string,
    id: number | string,
): Promise<SalaryExpenseMutationResponse> {
    const res = await SalaryExpenseService.delete(tenantSlug, id)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/salary-expenses`)
    }
    return res
}

export async function calculatePayableAmountAction(
    tenantSlug: string,
    employeeId: number | string,
    salaryMonth: string,
): Promise<PayableAmountResponse> {
    return SalaryExpenseService.calculatePayableAmount(tenantSlug, employeeId, salaryMonth)
}
