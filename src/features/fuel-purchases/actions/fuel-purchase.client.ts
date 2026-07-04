'use client'

import {
    createFuelPurchaseAction,
    deleteFuelPurchaseAction,
    updateFuelPurchaseAction,
    FuelPurchaseMutationResponse
} from "@/features/fuel-purchases"

export async function createFuelPurchaseClient(
    tenantSlug: string,
    formData: FormData,
): Promise<FuelPurchaseMutationResponse> {
    return createFuelPurchaseAction(tenantSlug, formData)
}

export async function updateFuelPurchaseClient(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<FuelPurchaseMutationResponse> {
    return updateFuelPurchaseAction(tenantSlug, id, formData)
}

export async function deleteFuelPurchaseClient(
    tenantSlug: string,
    id: number | string,
): Promise<FuelPurchaseMutationResponse> {
    return deleteFuelPurchaseAction(tenantSlug, id)
}
