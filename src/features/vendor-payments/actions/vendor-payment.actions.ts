'use server'

import { revalidatePath } from 'next/cache'
import { VendorPaymentService } from '@/features/vendor-payments'
import { VendorPaymentListResponse, VendorPaymentMutationResponse, VendorPaymentSingleResponse } from '@/features/vendor-payments'

export async function getVendorPaymentsAction(tenantSlug: string, page: number, search: string): Promise<VendorPaymentListResponse> {
    return VendorPaymentService.list(tenantSlug, page, search)
}

export async function getVendorPaymentAction(tenantSlug: string, id: number | string): Promise<VendorPaymentSingleResponse> {
    return VendorPaymentService.show(tenantSlug, id)
}

export async function createVendorPaymentAction(tenantSlug: string, formData: FormData): Promise<VendorPaymentMutationResponse> {
    const res = await VendorPaymentService.create(tenantSlug, formData)
    if (res.success) revalidatePath(`/${tenantSlug}/vendor-payments`)
    return res
}

export async function updateVendorPaymentAction(tenantSlug: string, id: number | string, formData: FormData): Promise<VendorPaymentMutationResponse> {
    const res = await VendorPaymentService.update(tenantSlug, id, formData)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/vendor-payments`)
        revalidatePath(`/${tenantSlug}/vendor-payments/${id}`)
    }
    return res
}

export async function deleteVendorPaymentAction(tenantSlug: string, id: number | string): Promise<VendorPaymentMutationResponse> {
    const res = await VendorPaymentService.delete(tenantSlug, id)
    if (res.success) revalidatePath(`/${tenantSlug}/vendor-payments`)
    return res
}
