'use server'

import { revalidatePath } from 'next/cache'
import {
    SupervisorListResponse,
    SupervisorMutationResponse,
    SupervisorPayload,
    SupervisorSingleResponse,
    SupervisorService
} from '@/features/supervisors'

export async function getSupervisorsAction(
    tenantSlug: string,
    page: number,
    search: string,
): Promise<SupervisorListResponse> {
    return SupervisorService.list(tenantSlug, page, search)
}

export async function getSupervisorAction(
    tenantSlug: string,
    id: number | string,
): Promise<SupervisorSingleResponse> {
    return SupervisorService.show(tenantSlug, id)
}

export async function createSupervisorAction(
    tenantSlug: string,
    formData: FormData,
): Promise<SupervisorMutationResponse> {
    const res = await SupervisorService.create(tenantSlug, formData)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/supervisors`)
    }
    return res
}

export async function updateSupervisorAction(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<SupervisorMutationResponse> {
    const res = await SupervisorService.update(tenantSlug, id, formData)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/supervisors`)
        revalidatePath(`/${tenantSlug}/supervisors/${id}`)
    }
    return res
}

export async function deleteSupervisorAction(
    tenantSlug: string,
    id: number | string,
): Promise<SupervisorMutationResponse> {
    const res = await SupervisorService.delete(tenantSlug, id)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/supervisors`)
    }
    return res
}
