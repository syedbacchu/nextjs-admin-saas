import { request } from '@/lib/http/request'
import {
    TenantSettingsDeletePayload,
    TenantSettingsDeleteResponse,
    TenantSettingItem,
    TenantSettingsResponse,
    TenantSettingsUpdateResponse,
} from '@/features/settings'

export const TenantSettingsService = {
    get(tenantSlug: string): Promise<TenantSettingsResponse> {
        return request<Record<string, string | null>>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/account/settings`,
        })
    },

    getPublic(tenantSlug: string): Promise<TenantSettingsResponse> {
        return request<Record<string, string | null>>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/public/settings`,
            includeServerSecret: false,
            includeAuthToken: false,
        })
    },

    update(tenantSlug: string, settings: TenantSettingItem[]): Promise<TenantSettingsUpdateResponse> {
        return request<Record<string, string | null>>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/account/settings`,
            data: { settings },
        })
    },

    delete(tenantSlug: string, payload: TenantSettingsDeletePayload): Promise<TenantSettingsDeleteResponse> {
        return request<unknown[]>({
            method: 'DELETE',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/account/settings`,
            data: payload,
        })
    },
}
