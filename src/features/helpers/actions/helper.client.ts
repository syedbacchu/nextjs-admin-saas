'use client'

import {
    createHelperAction,
    deleteHelperAction,
    updateHelperAction,
    HelperMutationResponse
} from '@/features/helpers'

export async function createHelperClient(
    tenantSlug: string,
    formData: FormData,
): Promise<HelperMutationResponse> {
    return createHelperAction(tenantSlug, formData)
}

export async function updateHelperClient(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<HelperMutationResponse> {
    return updateHelperAction(tenantSlug, id, formData)
}

export async function deleteHelperClient(
    tenantSlug: string,
    id: number | string,
): Promise<HelperMutationResponse> {
    return deleteHelperAction(tenantSlug, id)
}
