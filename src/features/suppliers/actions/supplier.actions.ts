'use server'

import { revalidatePath } from 'next/cache'
import {
    SupplierListResponse,
    SupplierMutationResponse,
    SupplierSingleResponse,
    SupplierService
} from '@/features/suppliers'

export async function getSuppliersAction(
    tenantSlug: string,
    page: number,
    search: string,
): Promise<SupplierListResponse> {
    return SupplierService.list(tenantSlug, page, search)
}

export async function getSupplierAction(
    tenantSlug: string,
    id: number | string,
): Promise<SupplierSingleResponse> {
    return SupplierService.show(tenantSlug, id)
}

export async function createSupplierAction(
    tenantSlug: string,
    formData: FormData,
): Promise<SupplierMutationResponse> {
    const res = await SupplierService.create(tenantSlug, formData)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/suppliers`)
    }
    return res
}

export async function updateSupplierAction(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<SupplierMutationResponse> {
    const res = await SupplierService.update(tenantSlug, id, formData)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/suppliers`)
        revalidatePath(`/${tenantSlug}/suppliers/${id}`)
    }
    return res
}

export async function deleteSupplierAction(
    tenantSlug: string,
    id: number | string,
): Promise<SupplierMutationResponse> {
    const res = await SupplierService.delete(tenantSlug, id)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/suppliers`)
    }
    return res
}
