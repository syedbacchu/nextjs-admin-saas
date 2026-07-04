'use client'

import { createVehicleAction, deleteVehicleAction, updateVehicleAction, VehicleMutationResponse, VehiclePayload } from '@/features/vehicles'

export async function createVehicleClient(tenantSlug: string, payload: VehiclePayload): Promise<VehicleMutationResponse> {
    return createVehicleAction(tenantSlug, payload)
}

export async function updateVehicleClient(tenantSlug: string, id: number | string, payload: VehiclePayload): Promise<VehicleMutationResponse> {
    return updateVehicleAction(tenantSlug, id, payload)
}

export async function deleteVehicleClient(tenantSlug: string, id: number | string): Promise<VehicleMutationResponse> {
    return deleteVehicleAction(tenantSlug, id)
}
