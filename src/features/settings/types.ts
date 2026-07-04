import { ApiResponse } from '@/types/api'

export interface TenantSettingsMap {
    [slug: string]: string | null | undefined
}

export interface TenantSettingItem {
    slug: string
    value: string
}

export interface TenantSettingsDeletePayload {
    slugs: string[]
}

export type TenantSettingsResponse = ApiResponse<TenantSettingsMap>
export type TenantSettingsUpdateResponse = ApiResponse<TenantSettingsMap>
export type TenantSettingsDeleteResponse = ApiResponse<unknown[]>
