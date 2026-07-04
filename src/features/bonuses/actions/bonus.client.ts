'use client'

import {
    createBonusAction,
    deleteBonusAction,
    updateBonusAction,
    BonusMutationResponse,
} from '@/features/bonuses'

export async function createBonusClient(
    tenantSlug: string,
    formData: FormData,
): Promise<BonusMutationResponse> {
    return createBonusAction(tenantSlug, formData)
}

export async function updateBonusClient(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<BonusMutationResponse> {
    return updateBonusAction(tenantSlug, id, formData)
}

export async function deleteBonusClient(
    tenantSlug: string,
    id: number | string,
): Promise<BonusMutationResponse> {
    return deleteBonusAction(tenantSlug, id)
}
