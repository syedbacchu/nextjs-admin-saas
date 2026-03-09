'use server'

import { revalidatePath } from 'next/cache'
import { VehicleService } from '@/services/vehicle/vehicle.service'
import {
    VehicleListResponse,
    VehicleMutationResponse,
    VehicleSingleResponse,
} from '@/services/vehicle/vehicle.types'

export async function getVehiclesAction(
    tenantSlug: string,
    page: number,
    search: string,
): Promise<VehicleListResponse> {
    return VehicleService.list(tenantSlug, page, search)
}

export async function getVehicleAction(
    tenantSlug: string,
    id: number | string,
): Promise<VehicleSingleResponse> {
    return VehicleService.show(tenantSlug, id)
}

export async function createVehicleAction(
    tenantSlug: string,
    formData: FormData,
): Promise<VehicleMutationResponse> {
    const res = await VehicleService.create(tenantSlug, formData)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/vehicles`)
    }
    return res
}

export async function updateVehicleAction(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<VehicleMutationResponse> {
    const res = await VehicleService.update(tenantSlug, id, formData)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/vehicles`)
        revalidatePath(`/${tenantSlug}/vehicles/${id}`)
    }
    return res
}

export async function deleteVehicleAction(
    tenantSlug: string,
    id: number | string,
): Promise<VehicleMutationResponse> {
    const res = await VehicleService.delete(tenantSlug, id)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/vehicles`)
    }
    return res
}
