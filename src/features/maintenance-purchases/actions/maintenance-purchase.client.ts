'use client'

import {
    createMaintenancePurchaseAction,
    deleteMaintenancePurchaseAction,
    updateMaintenancePurchaseAction,
    MaintenancePurchaseMutationResponse
} from '@/features/maintenance-purchases'

export async function createMaintenancePurchaseClient(
    tenantSlug: string,
    formData: FormData,
): Promise<MaintenancePurchaseMutationResponse> {
    return createMaintenancePurchaseAction(tenantSlug, formData)
}

export async function updateMaintenancePurchaseClient(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<MaintenancePurchaseMutationResponse> {
    return updateMaintenancePurchaseAction(tenantSlug, id, formData)
}

export async function deleteMaintenancePurchaseClient(
    tenantSlug: string,
    id: number | string,
): Promise<MaintenancePurchaseMutationResponse> {
    return deleteMaintenancePurchaseAction(tenantSlug, id)
}
