'use server'

import { revalidatePath } from 'next/cache'
import {
    TenantSettingsDeletePayload,
    TenantSettingsDeleteResponse,
    TenantSettingItem,
    TenantSettingsResponse,
    TenantSettingsUpdateResponse,
    TenantSettingsService
} from '@/features/settings'

export async function getTenantSettingsAction(tenantSlug: string): Promise<TenantSettingsResponse> {
    return TenantSettingsService.get(tenantSlug)
}

export async function getPublicTenantSettingsAction(tenantSlug: string): Promise<TenantSettingsResponse> {
    return TenantSettingsService.getPublic(tenantSlug)
}

export async function updateTenantSettingsAction(
    tenantSlug: string,
    settings: TenantSettingItem[],
): Promise<TenantSettingsUpdateResponse> {
    const res = await TenantSettingsService.update(tenantSlug, settings)

    if (res.success) {
        revalidatePath(`/${tenantSlug}/settings`)
    }

    return res
}

export async function deleteTenantSettingsAction(
    tenantSlug: string,
    payload: TenantSettingsDeletePayload,
): Promise<TenantSettingsDeleteResponse> {
    const res = await TenantSettingsService.delete(tenantSlug, payload)

    if (res.success) {
        revalidatePath(`/${tenantSlug}/settings`)
    }

    return res
}
