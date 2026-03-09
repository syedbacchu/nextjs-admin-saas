'use server'

import { revalidatePath } from 'next/cache'
import { ProfileService } from '@/services/profile/profile.service'
import {
    ChangePasswordResponse,
    ProfileResponse,
    UpdateProfileResponse,
} from '@/services/profile/profile.types'

export async function getProfileAction(tenantSlug: string): Promise<ProfileResponse> {
    return ProfileService.profile(tenantSlug)
}

export async function updateProfileAction(
    tenantSlug: string,
    formData: FormData,
): Promise<UpdateProfileResponse> {
    const res = await ProfileService.updateProfile(tenantSlug, formData)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/profile`)
        revalidatePath(`/${tenantSlug}/profile/update`)
    }
    return res
}

export async function changePasswordAction(
    tenantSlug: string,
    formData: FormData,
): Promise<ChangePasswordResponse> {
    return ProfileService.changePassword(tenantSlug, formData)
}
