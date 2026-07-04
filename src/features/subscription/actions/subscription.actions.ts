'use server'

import { SubscriptionDetailsResponse, SubscriptionService } from '@/features/subscription'

export async function getSubscriptionDetailsAction(
    tenantSlug: string,
): Promise<SubscriptionDetailsResponse> {
    return SubscriptionService.details(tenantSlug)
}
