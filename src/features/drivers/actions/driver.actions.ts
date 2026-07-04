'use server'

import { revalidatePath } from 'next/cache'
import {
    DriverCreateLoginResponse,
    DriverListResponse,
    DriverMutationResponse,
    DriverService,
    DriverSingleResponse, DriverVehicleCategoryListResponse
} from "@/features/drivers";


function revalidateDriverPaths(tenantSlug: string) {
    revalidatePath(`/${tenantSlug}/drivers`)
}

export async function getDriversAction(
    tenantSlug: string,
    page: number,
    search: string,
): Promise<DriverListResponse> {
    return DriverService.list(tenantSlug, page, search)
}

export async function getDriverAction(
    tenantSlug: string,
    id: number | string,
): Promise<DriverSingleResponse> {
    return DriverService.show(tenantSlug, id)
}

export async function createDriverAction(
    tenantSlug: string,
    formData: FormData,
): Promise<DriverMutationResponse> {
    const res = await DriverService.create(tenantSlug, formData)
    if (res.success) {
        revalidateDriverPaths(tenantSlug)
    }
    return res
}

export async function updateDriverAction(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<DriverMutationResponse> {
    const res = await DriverService.update(tenantSlug, id, formData)
    if (res.success) {
        revalidateDriverPaths(tenantSlug)
        revalidatePath(`/${tenantSlug}/drivers/${id}`)
    }
    return res
}

export async function deleteDriverAction(
    tenantSlug: string,
    id: number | string,
): Promise<DriverMutationResponse> {
    const res = await DriverService.delete(tenantSlug, id)
    if (res.success) {
        revalidateDriverPaths(tenantSlug)
    }
    return res
}

export async function createDriverLoginAction(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<DriverCreateLoginResponse> {
    const res = await DriverService.createLogin(tenantSlug, id, formData)
    if (res.success) {
        revalidateDriverPaths(tenantSlug)
        revalidatePath(`/${tenantSlug}/drivers/${id}`)
    }
    return res
}

export async function getDriverVehicleCategoriesAction(
    page: number = 1,
    search: string = '',
): Promise<DriverVehicleCategoryListResponse> {
    return DriverService.vehicleCategories(page, search)
}
