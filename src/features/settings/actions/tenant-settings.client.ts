'use client'

import {
    TenantSettingsDeletePayload,
    TenantSettingsDeleteResponse,
    TenantSettingItem,
    TenantSettingsUpdateResponse,
    deleteTenantSettingsAction,
    updateTenantSettingsAction,
} from '@/features/settings'

export async function updateTenantSettingsClient(
    tenantSlug: string,
    settings: TenantSettingItem[],
): Promise<TenantSettingsUpdateResponse> {
    return updateTenantSettingsAction(tenantSlug, settings)
}

export async function deleteTenantSettingsClient(
    tenantSlug: string,
    payload: TenantSettingsDeletePayload,
): Promise<TenantSettingsDeleteResponse> {
    return deleteTenantSettingsAction(tenantSlug, payload)
}
