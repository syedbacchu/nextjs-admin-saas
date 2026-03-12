'use client'

import {
    createDriverAction,
    deleteDriverAction,
    updateDriverAction,
} from '@/services/driver/driver.actions'
import { DriverMutationResponse } from '@/services/driver/driver.types'

export async function createDriverClient(
    tenantSlug: string,
    formData: FormData,
): Promise<DriverMutationResponse> {
    return createDriverAction(tenantSlug, formData)
}

export async function updateDriverClient(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<DriverMutationResponse> {
    return updateDriverAction(tenantSlug, id, formData)
}

export async function deleteDriverClient(
    tenantSlug: string,
    id: number | string,
): Promise<DriverMutationResponse> {
    return deleteDriverAction(tenantSlug, id)
}
