'use client'


import {
    createDriverAction, createDriverLoginAction,
    deleteDriverAction,
    DriverCreateLoginResponse,
    DriverMutationResponse,
    updateDriverAction
} from "@/features/drivers";

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

export async function createDriverLoginClient(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<DriverCreateLoginResponse> {
    return createDriverLoginAction(tenantSlug, id, formData)
}
