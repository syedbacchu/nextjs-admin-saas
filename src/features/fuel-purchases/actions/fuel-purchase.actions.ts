'use server'

import { revalidatePath } from 'next/cache'
import {
    FuelPurchaseListResponse,
    FuelPurchaseMutationResponse,
    FuelPurchaseSingleResponse,
    FuelPurchaseService
} from "@/features/fuel-purchases"

function revalidateFuelPurchasePaths(tenantSlug: string) {
    revalidatePath(`/${tenantSlug}/fuel-purchases`)
}

export async function getFuelPurchasesAction(
    tenantSlug: string,
    page: number,
    search: string,
    filters?: {
        office_id?: string
        supplier_id?: string
        vehicle_id?: string
        fuel_type?: string
    },
): Promise<FuelPurchaseListResponse> {
    return FuelPurchaseService.list(tenantSlug, page, search, filters)
}

export async function getFuelPurchaseAction(
    tenantSlug: string,
    id: number | string,
): Promise<FuelPurchaseSingleResponse> {
    return FuelPurchaseService.show(tenantSlug, id)
}

export async function createFuelPurchaseAction(
    tenantSlug: string,
    formData: FormData,
): Promise<FuelPurchaseMutationResponse> {
    const res = await FuelPurchaseService.create(tenantSlug, formData)
    if (res.success) {
        revalidateFuelPurchasePaths(tenantSlug)
    }
    return res
}

export async function updateFuelPurchaseAction(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<FuelPurchaseMutationResponse> {
    const res = await FuelPurchaseService.update(tenantSlug, id, formData)
    if (res.success) {
        revalidateFuelPurchasePaths(tenantSlug)
        revalidatePath(`/${tenantSlug}/fuel-purchases/${id}`)
    }
    return res
}

export async function deleteFuelPurchaseAction(
    tenantSlug: string,
    id: number | string,
): Promise<FuelPurchaseMutationResponse> {
    const res = await FuelPurchaseService.delete(tenantSlug, id)
    if (res.success) {
        revalidateFuelPurchasePaths(tenantSlug)
    }
    return res
}
