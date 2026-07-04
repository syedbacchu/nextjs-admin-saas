'use client'

import {
    ChangePasswordResponse,
    UpdateProfileResponse,
    changePasswordAction,
    updateProfileAction,
} from '@/features/profile'

export async function updateProfileClient(
    tenantSlug: string,
    formData: FormData,
): Promise<UpdateProfileResponse> {
    return updateProfileAction(tenantSlug, formData)
}

export async function changePasswordClient(
    tenantSlug: string,
    formData: FormData,
): Promise<ChangePasswordResponse> {
    return changePasswordAction(tenantSlug, formData)
}
