'use server'

import { revalidatePath } from 'next/cache'
import { StaffService } from '@/services/staff/staff.service'
import {
    StaffListResponse,
    StaffMutationResponse,
    StaffSingleResponse,
} from '@/services/staff/staff.types'

export async function getStaffsAction(
    tenantSlug: string,
    page: number,
    search: string,
): Promise<StaffListResponse> {
    return StaffService.list(tenantSlug, page, search)
}

export async function getStaffAction(
    tenantSlug: string,
    id: number | string,
): Promise<StaffSingleResponse> {
    return StaffService.show(tenantSlug, id)
}

export async function createStaffAction(
    tenantSlug: string,
    formData: FormData,
): Promise<StaffMutationResponse> {
    const res = await StaffService.create(tenantSlug, formData)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/staff`)
    }
    return res
}

export async function updateStaffAction(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<StaffMutationResponse> {
    const res = await StaffService.update(tenantSlug, id, formData)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/staff`)
        revalidatePath(`/${tenantSlug}/staff/${id}`)
    }
    return res
}

export async function deleteStaffAction(
    tenantSlug: string,
    id: number | string,
): Promise<StaffMutationResponse> {
    const res = await StaffService.delete(tenantSlug, id)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/staff`)
    }
    return res
}
