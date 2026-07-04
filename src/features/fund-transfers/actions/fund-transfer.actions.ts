'use server'

import { revalidatePath } from 'next/cache'
import {
    FundTransferListResponse,
    FundTransferMutationResponse,
    FundTransferSingleResponse,
    FundTransferService
} from '@/features/fund-transfers'

export async function getFundTransfersAction(
    tenantSlug: string,
    page: number,
    search: string,
): Promise<FundTransferListResponse> {
    return FundTransferService.list(tenantSlug, page, search)
}

export async function getFundTransferAction(
    tenantSlug: string,
    id: number | string,
): Promise<FundTransferSingleResponse> {
    return FundTransferService.show(tenantSlug, id)
}

export async function createFundTransferAction(
    tenantSlug: string,
    formData: FormData,
): Promise<FundTransferMutationResponse> {
    const res = await FundTransferService.create(tenantSlug, formData)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/fund-transfers`)
    }
    return res
}

export async function updateFundTransferAction(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<FundTransferMutationResponse> {
    const res = await FundTransferService.update(tenantSlug, id, formData)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/fund-transfers`)
        revalidatePath(`/${tenantSlug}/fund-transfers/${id}`)
    }
    return res
}

export async function deleteFundTransferAction(
    tenantSlug: string,
    id: number | string,
): Promise<FundTransferMutationResponse> {
    const res = await FundTransferService.delete(tenantSlug, id)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/fund-transfers`)
    }
    return res
}
