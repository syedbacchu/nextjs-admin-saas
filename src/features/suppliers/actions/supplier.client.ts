'use client'

import {
    createSupplierAction,
    deleteSupplierAction,
    updateSupplierAction,
    SupplierMutationResponse
} from '@/features/suppliers'

export async function createSupplierClient(
    tenantSlug: string,
    formData: FormData,
): Promise<SupplierMutationResponse> {
    return createSupplierAction(tenantSlug, formData)
}

export async function updateSupplierClient(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<SupplierMutationResponse> {
    return updateSupplierAction(tenantSlug, id, formData)
}

export async function deleteSupplierClient(
    tenantSlug: string,
    id: number | string,
): Promise<SupplierMutationResponse> {
    return deleteSupplierAction(tenantSlug, id)
}
