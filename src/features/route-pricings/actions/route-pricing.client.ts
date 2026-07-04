'use client'

import {
    createRoutePricingAction,
    deleteRoutePricingAction,
    updateRoutePricingAction,
    RoutePricingMutationResponse,
    RoutePricingPayload
} from '@/features/route-pricings'

export async function createRoutePricingClient(
    tenantSlug: string,
    payload: RoutePricingPayload,
): Promise<RoutePricingMutationResponse> {
    return createRoutePricingAction(tenantSlug, payload)
}

export async function updateRoutePricingClient(
    tenantSlug: string,
    id: number | string,
    payload: RoutePricingPayload,
): Promise<RoutePricingMutationResponse> {
    return updateRoutePricingAction(tenantSlug, id, payload)
}

export async function deleteRoutePricingClient(
    tenantSlug: string,
    id: number | string,
): Promise<RoutePricingMutationResponse> {
    return deleteRoutePricingAction(tenantSlug, id)
}
