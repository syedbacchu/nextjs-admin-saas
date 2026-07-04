'use client'

import { request } from '@/lib/http/request'
import { AreaMutationResponse, AreaPayload, AreaListResponse, createAreaAction } from '@/features/area'

export async function createAreaClient(
    tenantSlug: string,
    payload: AreaPayload,
): Promise<AreaMutationResponse> {
    return createAreaAction(tenantSlug, payload)
}

export async function getAreasClient(search: string = ''): Promise<AreaListResponse> {
    return request<AreaListResponse['data']>({
        method: 'GET',
        url: '/user/areas',
        params: search ? { search } : undefined,
    })
}
