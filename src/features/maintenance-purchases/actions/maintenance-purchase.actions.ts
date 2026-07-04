'use server'

import { revalidatePath } from 'next/cache'
import {
    MaintenancePurchaseListResponse,
    MaintenancePurchaseMutationResponse,
    MaintenancePurchaseSingleResponse,
    MaintenancePurchaseService
} from '@/features/maintenance-purchases'

export async function getMaintenancePurchasesAction(
    tenantSlug: string,
    page: number,
    search: string,
    filters?: {
        office_id?: string
        supplier_id?: string
        vehicle_id?: string
        category?: string
    },
): Promise<MaintenancePurchaseListResponse> {
    return MaintenancePurchaseService.list(tenantSlug, page, search, filters)
}

export async function getMaintenancePurchaseAction(
    tenantSlug: string,
    id: number | string,
): Promise<MaintenancePurchaseSingleResponse> {
    return MaintenancePurchaseService.show(tenantSlug, id)
}

export async function createMaintenancePurchaseAction(
    tenantSlug: string,
    formData: FormData,
): Promise<MaintenancePurchaseMutationResponse> {
    const res = await MaintenancePurchaseService.create(tenantSlug, formData)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/maintenance-purchases`)
    }
    return res
}

export async function updateMaintenancePurchaseAction(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<MaintenancePurchaseMutationResponse> {
    const res = await MaintenancePurchaseService.update(tenantSlug, id, formData)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/maintenance-purchases`)
        revalidatePath(`/${tenantSlug}/maintenance-purchases/${id}`)
    }
    return res
}

export async function deleteMaintenancePurchaseAction(
    tenantSlug: string,
    id: number | string,
): Promise<MaintenancePurchaseMutationResponse> {
    const res = await MaintenancePurchaseService.delete(tenantSlug, id)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/maintenance-purchases`)
    }
    return res
}
