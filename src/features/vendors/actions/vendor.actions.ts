'use server'

import { revalidatePath } from 'next/cache'
import { VendorService } from '@/features/vendors'
import { VendorListResponse, VendorMutationResponse, VendorSingleResponse, VendorVehicleCategoryListResponse } from '@/features/vendors'

export async function getVendorsAction(tenantSlug: string, page: number, search: string): Promise<VendorListResponse> {
    return VendorService.list(tenantSlug, page, search)
}

export async function getVendorAction(tenantSlug: string, id: number | string): Promise<VendorSingleResponse> {
    return VendorService.show(tenantSlug, id)
}

export async function createVendorAction(tenantSlug: string, formData: FormData): Promise<VendorMutationResponse> {
    const res = await VendorService.create(tenantSlug, formData)
    if (res.success) revalidatePath(`/${tenantSlug}/vendors`)
    return res
}

export async function updateVendorAction(tenantSlug: string, id: number | string, formData: FormData): Promise<VendorMutationResponse> {
    const res = await VendorService.update(tenantSlug, id, formData)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/vendors`)
        revalidatePath(`/${tenantSlug}/vendors/${id}`)
    }
    return res
}

export async function deleteVendorAction(tenantSlug: string, id: number | string): Promise<VendorMutationResponse> {
    const res = await VendorService.delete(tenantSlug, id)
    if (res.success) revalidatePath(`/${tenantSlug}/vendors`)
    return res
}

export async function getVendorVehicleCategoriesAction(page: number = 1, search: string = ''): Promise<VendorVehicleCategoryListResponse> {
    return VendorService.vehicleCategories(page, search)
}
