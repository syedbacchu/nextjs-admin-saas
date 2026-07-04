import { request } from '@/lib/http/request'
import {
    SubscriptionDetailsData,
    SubscriptionDetailsResponse,
} from '@/features/subscription'

export const SubscriptionService = {
    details(tenantSlug: string): Promise<SubscriptionDetailsResponse> {
        return request<SubscriptionDetailsData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/account/subscription-details`,
        })
    },
}
