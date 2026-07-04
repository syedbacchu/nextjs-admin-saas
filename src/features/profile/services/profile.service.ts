import { request } from '@/lib/http/request'
import {
    ChangePasswordResponse,
    ProfileData,
    ProfileResponse,
    ProfileUser,
    UpdateProfileResponse,
} from '@/features/profile'

export const ProfileService = {
    profile(tenantSlug: string): Promise<ProfileResponse> {
        return request<ProfileData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/account/profile`,
        })
    },

    updateProfile(tenantSlug: string, formData: FormData): Promise<UpdateProfileResponse> {
        return request<ProfileUser>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/account/update-profile`,
            data: formData,
        })
    },

    changePassword(tenantSlug: string, formData: FormData): Promise<ChangePasswordResponse> {
        return request<unknown[]>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/account/change-password`,
            data: formData,
        })
    },
}
