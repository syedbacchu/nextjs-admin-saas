'use client'

import {
    createOfficialProductPurchaseAction,
    deleteOfficialProductPurchaseAction,
    updateOfficialProductPurchaseAction,
    OfficialProductPurchaseMutationResponse
} from '@/features/official-product-purchases'

export async function createOfficialProductPurchaseClient(
    tenantSlug: string,
    formData: FormData,
): Promise<OfficialProductPurchaseMutationResponse> {
    return createOfficialProductPurchaseAction(tenantSlug, formData)
}

export async function updateOfficialProductPurchaseClient(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<OfficialProductPurchaseMutationResponse> {
    return updateOfficialProductPurchaseAction(tenantSlug, id, formData)
}

export async function deleteOfficialProductPurchaseClient(
    tenantSlug: string,
    id: number | string,
): Promise<OfficialProductPurchaseMutationResponse> {
    return deleteOfficialProductPurchaseAction(tenantSlug, id)
}
