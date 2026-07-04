'use server'

import { revalidatePath } from 'next/cache'
import { VehicleService } from '@/features/vehicles'
import {
    VehicleListResponse,
    VehicleMutationResponse,
    VehiclePayload,
    VehicleRegistrationListResponse,
    VehicleSingleResponse,
} from '@/features/vehicles'

export async function getVehiclesAction(tenantSlug: string, page: number, search: string): Promise<VehicleListResponse> {
    return VehicleService.list(tenantSlug, page, search)
}

export async function getVehicleAction(tenantSlug: string, id: number | string): Promise<VehicleSingleResponse> {
    return VehicleService.show(tenantSlug, id)
}

export async function createVehicleAction(tenantSlug: string, payload: VehiclePayload): Promise<VehicleMutationResponse> {
    const res = await VehicleService.create(tenantSlug, payload)
    if (res.success) revalidatePath(`/${tenantSlug}/vehicles`)
    return res
}

export async function updateVehicleAction(tenantSlug: string, id: number | string, payload: VehiclePayload): Promise<VehicleMutationResponse> {
    const res = await VehicleService.update(tenantSlug, id, payload)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/vehicles`)
        revalidatePath(`/${tenantSlug}/vehicles/${id}`)
    }
    return res
}

export async function deleteVehicleAction(tenantSlug: string, id: number | string): Promise<VehicleMutationResponse> {
    const res = await VehicleService.delete(tenantSlug, id)
    if (res.success) revalidatePath(`/${tenantSlug}/vehicles`)
    return res
}

export async function getVehicleRegistrationZonesAction(page: number = 1, search: string = ''): Promise<VehicleRegistrationListResponse> {
    return VehicleService.registrationZones(page, search)
}

export async function getVehicleRegistrationSerialsAction(page: number = 1, search: string = ''): Promise<VehicleRegistrationListResponse> {
    return VehicleService.registrationSerials(page, search)
}
