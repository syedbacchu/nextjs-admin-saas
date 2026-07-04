'use server'

import { revalidatePath } from 'next/cache'
import { BonusService } from '@/features/bonuses/services/bonus.service'
import {
    BonusListResponse,
    BonusMutationResponse,
    BonusSingleResponse,
} from '@/features/bonuses'

function revalidateBonusPaths(tenantSlug: string) {
    revalidatePath(`/${tenantSlug}/bonuses`)
}

export async function getBonusesAction(
    tenantSlug: string,
    page: number,
    search: string,
    filters?: {
        employee_id?: string
        office_id?: string
        salary_month?: string
    },
): Promise<BonusListResponse> {
    return BonusService.list(tenantSlug, page, search, filters)
}

export async function getBonusAction(
    tenantSlug: string,
    id: number | string,
): Promise<BonusSingleResponse> {
    return BonusService.show(tenantSlug, id)
}

export async function createBonusAction(
    tenantSlug: string,
    formData: FormData,
): Promise<BonusMutationResponse> {
    const res = await BonusService.create(tenantSlug, formData)
    if (res.success) {
        revalidateBonusPaths(tenantSlug)
    }
    return res
}

export async function updateBonusAction(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<BonusMutationResponse> {
    const res = await BonusService.update(tenantSlug, id, formData)
    if (res.success) {
        revalidateBonusPaths(tenantSlug)
        revalidatePath(`/${tenantSlug}/bonuses/${id}`)
    }
    return res
}

export async function deleteBonusAction(
    tenantSlug: string,
    id: number | string,
): Promise<BonusMutationResponse> {
    const res = await BonusService.delete(tenantSlug, id)
    if (res.success) {
        revalidateBonusPaths(tenantSlug)
    }
    return res
}
