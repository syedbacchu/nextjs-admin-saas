'use client'

import {
    createPaymentReceiveAction,
    deletePaymentReceiveAction,
    updatePaymentReceiveAction,
    PaymentReceiveMutationResponse
} from '@/features/payment-receives'

export async function createPaymentReceiveClient(
    tenantSlug: string,
    formData: FormData,
): Promise<PaymentReceiveMutationResponse> {
    return createPaymentReceiveAction(tenantSlug, formData)
}

export async function updatePaymentReceiveClient(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<PaymentReceiveMutationResponse> {
    return updatePaymentReceiveAction(tenantSlug, id, formData)
}

export async function deletePaymentReceiveClient(
    tenantSlug: string,
    id: number | string,
): Promise<PaymentReceiveMutationResponse> {
    return deletePaymentReceiveAction(tenantSlug, id)
}
