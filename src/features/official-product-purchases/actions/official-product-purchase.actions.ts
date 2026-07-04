'use server'

import { revalidatePath } from 'next/cache'
import {
    OfficialProductPurchaseListResponse,
    OfficialProductPurchaseMutationResponse,
    OfficialProductPurchaseSingleResponse,
    OfficialProductPurchaseService
} from '@/features/official-product-purchases'

export async function getOfficialProductPurchasesAction(
    tenantSlug: string,
    page: number,
    search: string,
    filters?: {
        office_id?: string
        supplier_id?: string
        category?: string
    },
): Promise<OfficialProductPurchaseListResponse> {
    return OfficialProductPurchaseService.list(tenantSlug, page, search, filters)
}

export async function getOfficialProductPurchaseAction(
    tenantSlug: string,
    id: number | string,
): Promise<OfficialProductPurchaseSingleResponse> {
    return OfficialProductPurchaseService.show(tenantSlug, id)
}

export async function createOfficialProductPurchaseAction(
    tenantSlug: string,
    formData: FormData,
): Promise<OfficialProductPurchaseMutationResponse> {
    const res = await OfficialProductPurchaseService.create(tenantSlug, formData)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/official-product-purchases`)
    }
    return res
}

export async function updateOfficialProductPurchaseAction(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<OfficialProductPurchaseMutationResponse> {
    const res = await OfficialProductPurchaseService.update(tenantSlug, id, formData)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/official-product-purchases`)
        revalidatePath(`/${tenantSlug}/official-product-purchases/${id}`)
    }
    return res
}

export async function deleteOfficialProductPurchaseAction(
    tenantSlug: string,
    id: number | string,
): Promise<OfficialProductPurchaseMutationResponse> {
    const res = await OfficialProductPurchaseService.delete(tenantSlug, id)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/official-product-purchases`)
    }
    return res
}
