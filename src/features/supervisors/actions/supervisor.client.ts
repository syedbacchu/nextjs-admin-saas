'use client'

import {
    createSupervisorAction,
    deleteSupervisorAction,
    updateSupervisorAction,
    SupervisorMutationResponse
} from '@/features/supervisors'

export async function createSupervisorClient(
    tenantSlug: string,
    formData: FormData,
): Promise<SupervisorMutationResponse> {
    return createSupervisorAction(tenantSlug, formData)
}

export async function updateSupervisorClient(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<SupervisorMutationResponse> {
    return updateSupervisorAction(tenantSlug, id, formData)
}

export async function deleteSupervisorClient(
    tenantSlug: string,
    id: number | string,
): Promise<SupervisorMutationResponse> {
    return deleteSupervisorAction(tenantSlug, id)
}
