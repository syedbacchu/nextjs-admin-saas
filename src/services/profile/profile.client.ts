'use client'

import {
    changePasswordAction,
    updateProfileAction,
} from '@/services/profile/profile.actions'
import {
    ChangePasswordResponse,
    UpdateProfileResponse,
} from '@/services/profile/profile.types'

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
