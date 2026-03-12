'use server'

import { revalidatePath } from 'next/cache'
import { DriverService } from '@/services/driver/driver.service'
import {
    DriverListResponse,
    DriverMutationResponse,
    DriverSingleResponse,
} from '@/services/driver/driver.types'

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
        revalidatePath(`/${tenantSlug}/drivers`)
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
        revalidatePath(`/${tenantSlug}/drivers`)
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
        revalidatePath(`/${tenantSlug}/drivers`)
    }
    return res
}
