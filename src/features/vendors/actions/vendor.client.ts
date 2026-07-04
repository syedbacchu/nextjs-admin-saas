'use client'

import { createVendorAction, deleteVendorAction, updateVendorAction, VendorMutationResponse } from '@/features/vendors'

export async function createVendorClient(tenantSlug: string, formData: FormData): Promise<VendorMutationResponse> {
    return createVendorAction(tenantSlug, formData)
}

export async function updateVendorClient(tenantSlug: string, id: number | string, formData: FormData): Promise<VendorMutationResponse> {
    return updateVendorAction(tenantSlug, id, formData)
}

export async function deleteVendorClient(tenantSlug: string, id: number | string): Promise<VendorMutationResponse> {
    return deleteVendorAction(tenantSlug, id)
}
