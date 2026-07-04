'use client'

import {
    createOfficeAction,
    deleteOfficeAction,
    updateOfficeAction,
    OfficeMutationResponse
} from '@/features/offices'

export async function createOfficeClient(
    tenantSlug: string,
    formData: FormData,
): Promise<OfficeMutationResponse> {
    return createOfficeAction(tenantSlug, formData)
}

export async function updateOfficeClient(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<OfficeMutationResponse> {
    return updateOfficeAction(tenantSlug, id, formData)
}

export async function deleteOfficeClient(
    tenantSlug: string,
    id: number | string,
): Promise<OfficeMutationResponse> {
    return deleteOfficeAction(tenantSlug, id)
}
