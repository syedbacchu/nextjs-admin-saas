'use server'

import { revalidatePath } from 'next/cache'
import {
    OfficeListResponse,
    OfficeMutationResponse,
    OfficeSingleResponse,
    OfficeService
} from '@/features/offices'

export async function getOfficesAction(
    tenantSlug: string,
    page: number,
    search: string,
): Promise<OfficeListResponse> {
    return OfficeService.list(tenantSlug, page, search)
}

export async function getOfficeAction(
    tenantSlug: string,
    id: number | string,
): Promise<OfficeSingleResponse> {
    return OfficeService.show(tenantSlug, id)
}

export async function createOfficeAction(
    tenantSlug: string,
    formData: FormData,
): Promise<OfficeMutationResponse> {
    const res = await OfficeService.create(tenantSlug, formData)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/offices`)
    }
    return res
}

export async function updateOfficeAction(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<OfficeMutationResponse> {
    const res = await OfficeService.update(tenantSlug, id, formData)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/offices`)
        revalidatePath(`/${tenantSlug}/offices/${id}`)
    }
    return res
}

export async function deleteOfficeAction(
    tenantSlug: string,
    id: number | string,
): Promise<OfficeMutationResponse> {
    const res = await OfficeService.delete(tenantSlug, id)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/offices`)
    }
    return res
}
