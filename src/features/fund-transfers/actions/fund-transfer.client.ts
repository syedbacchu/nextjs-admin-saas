'use client'

import {
    createFundTransferAction,
    deleteFundTransferAction,
    updateFundTransferAction,
    FundTransferMutationResponse
} from '@/features/fund-transfers'

export async function createFundTransferClient(
    tenantSlug: string,
    formData: FormData,
): Promise<FundTransferMutationResponse> {
    return createFundTransferAction(tenantSlug, formData)
}

export async function updateFundTransferClient(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<FundTransferMutationResponse> {
    return updateFundTransferAction(tenantSlug, id, formData)
}

export async function deleteFundTransferClient(
    tenantSlug: string,
    id: number | string,
): Promise<FundTransferMutationResponse> {
    return deleteFundTransferAction(tenantSlug, id)
}
