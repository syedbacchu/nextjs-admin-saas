'use client'

import {
    createDailyOfficeExpenseAction,
    DailyOfficeExpenseMutationResponse, deleteDailyOfficeExpenseAction,
    updateDailyOfficeExpenseAction
} from "@/features/daily-office-expenses";

export async function createDailyOfficeExpenseClient(
    tenantSlug: string,
    formData: FormData,
): Promise<DailyOfficeExpenseMutationResponse> {
    return createDailyOfficeExpenseAction(tenantSlug, formData)
}

export async function updateDailyOfficeExpenseClient(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<DailyOfficeExpenseMutationResponse> {
    return updateDailyOfficeExpenseAction(tenantSlug, id, formData)
}

export async function deleteDailyOfficeExpenseClient(
    tenantSlug: string,
    id: number | string,
): Promise<DailyOfficeExpenseMutationResponse> {
    return deleteDailyOfficeExpenseAction(tenantSlug, id)
}
