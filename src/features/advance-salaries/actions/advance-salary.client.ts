'use client'

import {
    createAdvanceSalaryAction,
    deleteAdvanceSalaryAction,
    updateAdvanceSalaryAction,
    AdvanceSalaryMutationResponse
} from '@/features/advance-salaries'

export async function createAdvanceSalaryClient(
    tenantSlug: string,
    formData: FormData,
): Promise<AdvanceSalaryMutationResponse> {
    return createAdvanceSalaryAction(tenantSlug, formData)
}

export async function updateAdvanceSalaryClient(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<AdvanceSalaryMutationResponse> {
    return updateAdvanceSalaryAction(tenantSlug, id, formData)
}

export async function deleteAdvanceSalaryClient(
    tenantSlug: string,
    id: number | string,
): Promise<AdvanceSalaryMutationResponse> {
    return deleteAdvanceSalaryAction(tenantSlug, id)
}
