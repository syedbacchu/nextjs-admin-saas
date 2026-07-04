'use server'

import { revalidatePath } from 'next/cache'
import {
    RentVehicleListResponse,
    RentVehicleMutationResponse,
    RentVehicleSingleResponse,
    RentVehicleService
} from '@/features/rent-vehicles'

export async function getRentVehiclesAction(
    tenantSlug: string,
    page: number,
    search: string,
): Promise<RentVehicleListResponse> {
    return RentVehicleService.list(tenantSlug, page, search)
}

export async function getRentVehicleAction(
    tenantSlug: string,
    id: number | string,
): Promise<RentVehicleSingleResponse> {
    return RentVehicleService.show(tenantSlug, id)
}

export async function createRentVehicleAction(
    tenantSlug: string,
    formData: FormData,
): Promise<RentVehicleMutationResponse> {
    const res = await RentVehicleService.create(tenantSlug, formData)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/rent-vehicles`)
    }
    return res
}

export async function updateRentVehicleAction(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<RentVehicleMutationResponse> {
    const res = await RentVehicleService.update(tenantSlug, id, formData)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/rent-vehicles`)
        revalidatePath(`/${tenantSlug}/rent-vehicles/${id}`)
    }
    return res
}

export async function deleteRentVehicleAction(
    tenantSlug: string,
    id: number | string,
): Promise<RentVehicleMutationResponse> {
    const res = await RentVehicleService.delete(tenantSlug, id)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/rent-vehicles`)
    }
    return res
}
