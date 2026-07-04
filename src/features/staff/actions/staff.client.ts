'use client'

import {
    createStaffAction,
    deleteStaffAction,
    updateStaffAction,
    updateStaffFeaturesAction,
    StaffMutationResponse
} from '@/features/staff'

export async function createStaffClient(
    tenantSlug: string,
    formData: FormData,
): Promise<StaffMutationResponse> {
    return createStaffAction(tenantSlug, formData)
}

export async function updateStaffClient(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<StaffMutationResponse> {
    return updateStaffAction(tenantSlug, id, formData)
}

export async function deleteStaffClient(
    tenantSlug: string,
    id: number | string,
): Promise<StaffMutationResponse> {
    return deleteStaffAction(tenantSlug, id)
}

export async function updateStaffFeaturesClient(
    tenantSlug: string,
    staffId: number | string,
    features: string[],
): Promise<StaffMutationResponse> {
    return updateStaffFeaturesAction(tenantSlug, staffId, features)
}
