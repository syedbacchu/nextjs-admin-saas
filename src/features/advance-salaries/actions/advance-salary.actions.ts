'use server'

import { revalidatePath } from 'next/cache'
import {
    AdvanceSalaryListResponse,
    AdvanceSalaryMutationResponse,
    AdvanceSalarySingleResponse,
    AdvanceSalaryService
} from '@/features/advance-salaries'

function revalidateAdvanceSalaryPaths(tenantSlug: string) {
    revalidatePath(`/${tenantSlug}/advance-salaries`)
}

export async function getAdvanceSalariesAction(
    tenantSlug: string,
    page: number,
    search: string,
    filters?: {
        employee_id?: string
        office_id?: string
        salary_month?: string
    },
): Promise<AdvanceSalaryListResponse> {
    return AdvanceSalaryService.list(tenantSlug, page, search, filters)
}

export async function getAdvanceSalaryAction(
    tenantSlug: string,
    id: number | string,
): Promise<AdvanceSalarySingleResponse> {
    return AdvanceSalaryService.show(tenantSlug, id)
}

export async function createAdvanceSalaryAction(
    tenantSlug: string,
    formData: FormData,
): Promise<AdvanceSalaryMutationResponse> {
    const res = await AdvanceSalaryService.create(tenantSlug, formData)
    if (res.success) {
        revalidateAdvanceSalaryPaths(tenantSlug)
    }
    return res
}

export async function updateAdvanceSalaryAction(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<AdvanceSalaryMutationResponse> {
    const res = await AdvanceSalaryService.update(tenantSlug, id, formData)
    if (res.success) {
        revalidateAdvanceSalaryPaths(tenantSlug)
        revalidatePath(`/${tenantSlug}/advance-salaries/${id}`)
    }
    return res
}

export async function deleteAdvanceSalaryAction(
    tenantSlug: string,
    id: number | string,
): Promise<AdvanceSalaryMutationResponse> {
    const res = await AdvanceSalaryService.delete(tenantSlug, id)
    if (res.success) {
        revalidateAdvanceSalaryPaths(tenantSlug)
    }
    return res
}
