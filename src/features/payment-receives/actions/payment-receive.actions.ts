'use server'

import { revalidatePath } from 'next/cache'
import {
    PaymentReceiveListResponse,
    PaymentReceiveMutationResponse,
    PaymentReceiveSingleResponse,
    PaymentReceiveService
} from '@/features/payment-receives'

export async function getPaymentReceivesAction(
    tenantSlug: string,
    page: number,
    search: string,
): Promise<PaymentReceiveListResponse> {
    return PaymentReceiveService.list(tenantSlug, page, search)
}

export async function getPaymentReceiveAction(
    tenantSlug: string,
    id: number | string,
): Promise<PaymentReceiveSingleResponse> {
    return PaymentReceiveService.show(tenantSlug, id)
}

export async function createPaymentReceiveAction(
    tenantSlug: string,
    formData: FormData,
): Promise<PaymentReceiveMutationResponse> {
    const res = await PaymentReceiveService.create(tenantSlug, formData)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/payment-receives`)
    }
    return res
}

export async function updatePaymentReceiveAction(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<PaymentReceiveMutationResponse> {
    const res = await PaymentReceiveService.update(tenantSlug, id, formData)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/payment-receives`)
        revalidatePath(`/${tenantSlug}/payment-receives/${id}`)
    }
    return res
}

export async function deletePaymentReceiveAction(
    tenantSlug: string,
    id: number | string,
): Promise<PaymentReceiveMutationResponse> {
    const res = await PaymentReceiveService.delete(tenantSlug, id)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/payment-receives`)
    }
    return res
}
