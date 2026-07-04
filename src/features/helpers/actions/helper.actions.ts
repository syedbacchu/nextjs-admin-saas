'use server'

import { revalidatePath } from 'next/cache'
import {
    HelperListResponse,
    HelperMutationResponse,
    HelperSingleResponse,
    HelperVehicleCategoryListResponse,
    HelperService
} from '@/features/helpers'

export async function getHelpersAction(
    tenantSlug: string,
    page: number,
    search: string,
): Promise<HelperListResponse> {
    return HelperService.list(tenantSlug, page, search)
}

export async function getHelperAction(
    tenantSlug: string,
    id: number | string,
): Promise<HelperSingleResponse> {
    return HelperService.show(tenantSlug, id)
}

export async function createHelperAction(
    tenantSlug: string,
    formData: FormData,
): Promise<HelperMutationResponse> {
    const res = await HelperService.create(tenantSlug, formData)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/helpers`)
    }
    return res
}

export async function updateHelperAction(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<HelperMutationResponse> {
    const res = await HelperService.update(tenantSlug, id, formData)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/helpers`)
        revalidatePath(`/${tenantSlug}/helpers/${id}`)
    }
    return res
}

export async function deleteHelperAction(
    tenantSlug: string,
    id: number | string,
): Promise<HelperMutationResponse> {
    const res = await HelperService.delete(tenantSlug, id)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/helpers`)
    }
    return res
}

export async function getHelperVehicleCategoriesAction(
    page: number = 1,
    search: string = '',
): Promise<HelperVehicleCategoryListResponse> {
    return HelperService.vehicleCategories(page, search)
}
