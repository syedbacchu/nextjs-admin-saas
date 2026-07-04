'use server'

import { revalidatePath } from 'next/cache'
import {
    StaffListResponse,
    StaffMutationResponse,
    StaffSingleResponse,
    StaffFeaturesResponse,
    StaffService
} from '@/features/staff'

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

export async function getStaffFeaturesAction(
    tenantSlug: string,
    staffId: number | string,
): Promise<StaffFeaturesResponse> {
    return StaffService.getStaffFeatures(tenantSlug, staffId)
}

export async function updateStaffFeaturesAction(
    tenantSlug: string,
    staffId: number | string,
    features: string[],
): Promise<StaffMutationResponse> {
    const res = await StaffService.updateStaffFeatures(tenantSlug, staffId, features)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/staff`)
        revalidatePath(`/${tenantSlug}/staff/${staffId}`)
    }
    return res
}

export async function getMyFeaturesAction(
    tenantSlug: string,
): Promise<StaffFeaturesResponse> {
    return StaffService.getMyFeatures(tenantSlug)
}
