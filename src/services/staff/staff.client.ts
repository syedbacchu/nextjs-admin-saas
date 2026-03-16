'use client'

import {
    createStaffAction,
    deleteStaffAction,
    updateStaffAction,
} from '@/services/staff/staff.actions'
import { StaffMutationResponse } from '@/services/staff/staff.types'

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
