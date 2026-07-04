'use client'

import { createVendorPaymentAction, deleteVendorPaymentAction, updateVendorPaymentAction, VendorPaymentMutationResponse } from '@/features/vendor-payments'

export async function createVendorPaymentClient(tenantSlug: string, formData: FormData): Promise<VendorPaymentMutationResponse> {
    return createVendorPaymentAction(tenantSlug, formData)
}

export async function updateVendorPaymentClient(tenantSlug: string, id: number | string, formData: FormData): Promise<VendorPaymentMutationResponse> {
    return updateVendorPaymentAction(tenantSlug, id, formData)
}

export async function deleteVendorPaymentClient(tenantSlug: string, id: number | string): Promise<VendorPaymentMutationResponse> {
    return deleteVendorPaymentAction(tenantSlug, id)
}
