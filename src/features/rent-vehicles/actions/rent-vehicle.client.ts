'use client'

import {
    createRentVehicleAction,
    deleteRentVehicleAction,
    updateRentVehicleAction,
    RentVehicleMutationResponse
} from '@/features/rent-vehicles'

export async function createRentVehicleClient(
    tenantSlug: string,
    formData: FormData,
): Promise<RentVehicleMutationResponse> {
    return createRentVehicleAction(tenantSlug, formData)
}

export async function updateRentVehicleClient(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<RentVehicleMutationResponse> {
    return updateRentVehicleAction(tenantSlug, id, formData)
}

export async function deleteRentVehicleClient(
    tenantSlug: string,
    id: number | string,
): Promise<RentVehicleMutationResponse> {
    return deleteRentVehicleAction(tenantSlug, id)
}
