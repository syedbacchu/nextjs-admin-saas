'use client'

import {
    createVehicleAction,
    deleteVehicleAction,
    updateVehicleAction,
} from '@/services/vehicle/vehicle.actions'
import { VehicleMutationResponse } from '@/services/vehicle/vehicle.types'

export async function createVehicleClient(
    tenantSlug: string,
    formData: FormData,
): Promise<VehicleMutationResponse> {
    return createVehicleAction(tenantSlug, formData)
}

export async function updateVehicleClient(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<VehicleMutationResponse> {
    return updateVehicleAction(tenantSlug, id, formData)
}

export async function deleteVehicleClient(
    tenantSlug: string,
    id: number | string,
): Promise<VehicleMutationResponse> {
    return deleteVehicleAction(tenantSlug, id)
}
