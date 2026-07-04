'use server'

import { revalidatePath } from 'next/cache'
import {
    TripListFilters,
    TripListResponse,
    TripMutationResponse,
    TripSingleResponse,
    TripService
} from '@/features/trip'

function revalidateTripListPaths(tenantSlug: string) {
    revalidatePath(`/${tenantSlug}/trips`)
    revalidatePath(`/${tenantSlug}/billing`)
    revalidatePath(`/${tenantSlug}/billing/pending-trips`)
    revalidatePath(`/${tenantSlug}/billing/submitted-trips`)
    revalidatePath(`/${tenantSlug}/billing/all-trips`)
}

export async function getTripsAction(
    tenantSlug: string,
    page: number,
    search: string,
    status?: number,
    filters?: TripListFilters,
): Promise<TripListResponse> {
    return TripService.list(tenantSlug, page, search, status, filters)
}

export async function getTripAction(
    tenantSlug: string,
    id: number | string,
): Promise<TripSingleResponse> {
    return TripService.show(tenantSlug, id)
}

export async function createTripAction(
    tenantSlug: string,
    formData: FormData,
): Promise<TripMutationResponse> {
    const res = await TripService.create(tenantSlug, formData)
    if (res.success) {
        revalidateTripListPaths(tenantSlug)
    }
    return res
}

export async function updateTripAction(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<TripMutationResponse> {
    const res = await TripService.update(tenantSlug, id, formData)
    if (res.success) {
        revalidateTripListPaths(tenantSlug)
        revalidatePath(`/${tenantSlug}/trips/${id}`)
    }
    return res
}

export async function deleteTripAction(
    tenantSlug: string,
    id: number | string,
): Promise<TripMutationResponse> {
    const res = await TripService.delete(tenantSlug, id)
    if (res.success) {
        revalidateTripListPaths(tenantSlug)
    }
    return res
}

export async function billSubmitTripsAction(
    tenantSlug: string,
    tripIds: Array<number | string>,
): Promise<TripMutationResponse> {
    const res = await TripService.billSubmit(tenantSlug, tripIds)
    if (res.success) {
        revalidateTripListPaths(tenantSlug)
    }
    return res
}

export async function getNextChallanNoAction(
    tenantSlug: string,
    date?: string,
): Promise<{ success: boolean; message: string; data: { challan_no: string } }> {
    return TripService.getNextChallanNo(tenantSlug, date)
}

export async function getLastOdometerReadingAction(
    tenantSlug: string,
    vehicleId: number | string,
): Promise<{
    success: boolean
    message: string
    data: {
        has_last_reading: boolean
        odometer_start_km: number | null
        last_trip: {
            id: number
            date: string
            challan_no: string
            odometer_start_km: number
            odometer_end_km: number
            running_km: number
        } | null
    }
}> {
    return TripService.getLastOdometerReading(tenantSlug, vehicleId)
}
