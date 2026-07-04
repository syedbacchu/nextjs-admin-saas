'use server'

import { revalidatePath } from 'next/cache'
import {
    DailyOfficeExpenseListResponse,
    DailyOfficeExpenseMutationResponse,
    DailyOfficeExpenseSingleResponse,
} from '../types'
import {DailyOfficeExpenseService} from "@/features/daily-office-expenses";

function revalidateDailyOfficeExpensePaths(tenantSlug: string) {
    revalidatePath(`/${tenantSlug}/daily-office-expenses`)
}

export async function getDailyOfficeExpensesAction(
    tenantSlug: string,
    page: number,
    search: string,
    filters?: {
        office_id?: string
        category?: string
    },
): Promise<DailyOfficeExpenseListResponse> {
    return DailyOfficeExpenseService.list(tenantSlug, page, search, filters)
}

export async function getDailyOfficeExpenseAction(
    tenantSlug: string,
    id: number | string,
): Promise<DailyOfficeExpenseSingleResponse> {
    return DailyOfficeExpenseService.show(tenantSlug, id)
}

export async function createDailyOfficeExpenseAction(
    tenantSlug: string,
    formData: FormData,
): Promise<DailyOfficeExpenseMutationResponse> {
    const res = await DailyOfficeExpenseService.create(tenantSlug, formData)
    if (res.success) {
        revalidateDailyOfficeExpensePaths(tenantSlug)
    }
    return res
}

export async function updateDailyOfficeExpenseAction(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<DailyOfficeExpenseMutationResponse> {
    const res = await DailyOfficeExpenseService.update(tenantSlug, id, formData)
    if (res.success) {
        revalidateDailyOfficeExpensePaths(tenantSlug)
        revalidatePath(`/${tenantSlug}/daily-office-expenses/${id}`)
    }
    return res
}

export async function deleteDailyOfficeExpenseAction(
    tenantSlug: string,
    id: number | string,
): Promise<DailyOfficeExpenseMutationResponse> {
    const res = await DailyOfficeExpenseService.delete(tenantSlug, id)
    if (res.success) {
        revalidateDailyOfficeExpensePaths(tenantSlug)
    }
    return res
}
