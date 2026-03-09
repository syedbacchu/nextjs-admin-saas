'use server'

import { SubscriptionService } from '@/services/subscription/subscription.service'
import { SubscriptionDetailsResponse } from '@/services/subscription/subscription.types'

export async function getSubscriptionDetailsAction(
    tenantSlug: string,
): Promise<SubscriptionDetailsResponse> {
    return SubscriptionService.details(tenantSlug)
}
