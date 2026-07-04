'use server'

import { revalidatePath } from 'next/cache'
import {
    RoutePricingAreaListResponse,
    RoutePricingCustomerListResponse,
    RoutePricingListResponse,
    RoutePricingPayload,
    RoutePricingMutationResponse,
    RoutePricingSingleResponse,
    RoutePricingVehicleCategoryListResponse,
    RoutePricingService
} from '@/features/route-pricings'

export async function getRoutePricingsAction(
    tenantSlug: string,
    page: number,
    search: string,
    customerId?: string,
): Promise<RoutePricingListResponse> {
    return RoutePricingService.list(tenantSlug, page, search, customerId)
}

export async function getRoutePricingAction(
    tenantSlug: string,
    id: number | string,
): Promise<RoutePricingSingleResponse> {
    return RoutePricingService.show(tenantSlug, id)
}

export async function createRoutePricingAction(
    tenantSlug: string,
    payload: RoutePricingPayload,
): Promise<RoutePricingMutationResponse> {
    const res = await RoutePricingService.create(tenantSlug, payload)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/route-pricings`)
    }
    return res
}

export async function updateRoutePricingAction(
    tenantSlug: string,
    id: number | string,
    payload: RoutePricingPayload,
): Promise<RoutePricingMutationResponse> {
    const res = await RoutePricingService.update(tenantSlug, id, payload)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/route-pricings`)
        revalidatePath(`/${tenantSlug}/route-pricings/${id}`)
    }
    return res
}

export async function deleteRoutePricingAction(
    tenantSlug: string,
    id: number | string,
): Promise<RoutePricingMutationResponse> {
    const res = await RoutePricingService.delete(tenantSlug, id)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/route-pricings`)
    }
    return res
}

export async function getRoutePricingCustomersAction(
    tenantSlug: string,
    page: number = 1,
    search: string = '',
): Promise<RoutePricingCustomerListResponse> {
    return RoutePricingService.customers(tenantSlug, page, search)
}

export async function getRoutePricingVehicleCategoriesAction(
    page: number = 1,
    search: string = '',
): Promise<RoutePricingVehicleCategoryListResponse> {
    return RoutePricingService.vehicleCategories(page, search)
}

export async function getRoutePricingAreasAction(
    page: number = 1,
    search: string = '',
): Promise<RoutePricingAreaListResponse> {
    return RoutePricingService.areas(page, search)
}

export async function getRouteDistanceAction(
    tenantSlug: string,
    loadAreaId: number | string,
    unloadAreaId: number | string,
): Promise<{ success: boolean; message: string; data: { distance: number } }> {
    return RoutePricingService.getDistanceByRoute(tenantSlug, loadAreaId, unloadAreaId)
}

export async function calculateRouteDistanceByGoogleMapsAction(
    tenantSlug: string,
    loadAreaId: number | string,
    unloadAreaId: number | string,
): Promise<{
    success: boolean
    message: string
    data: {
        distance: number
        distance_text: string
        duration_text: string | null
        origin: string
        destination: string
        provider: string
        source: 'provider' | 'route_pricing'
    }
}> {
    return RoutePricingService.calculateDistanceByGoogleMaps(tenantSlug, loadAreaId, unloadAreaId)
}
