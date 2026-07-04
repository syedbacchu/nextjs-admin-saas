'use client'

import {
    createTripAction,
    billSubmitTripsAction,
    deleteTripAction,
    updateTripAction,
    TripMutationResponse
} from '@/features/trip'

export async function createTripClient(
    tenantSlug: string,
    formData: FormData,
): Promise<TripMutationResponse> {
    return createTripAction(tenantSlug, formData)
}

export async function updateTripClient(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<TripMutationResponse> {
    return updateTripAction(tenantSlug, id, formData)
}

export async function deleteTripClient(
    tenantSlug: string,
    id: number | string,
): Promise<TripMutationResponse> {
    return deleteTripAction(tenantSlug, id)
}

export async function billSubmitTripsClient(
    tenantSlug: string,
    tripIds: Array<number | string>,
): Promise<TripMutationResponse> {
    return billSubmitTripsAction(tenantSlug, tripIds)
}
