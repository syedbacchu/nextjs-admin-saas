'use server'

import { AreaMutationResponse, AreaPayload, AreaService } from '@/features/area'

export async function createAreaAction(
    tenantSlug: string,
    payload: AreaPayload,
): Promise<AreaMutationResponse> {
    return AreaService.create(tenantSlug, payload)
}
