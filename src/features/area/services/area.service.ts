import { request } from '@/lib/http/request'
import { Area, AreaMutationResponse, AreaPayload } from '@/features/area'

export const AreaService = {
    create(tenantSlug: string, data: AreaPayload): Promise<AreaMutationResponse> {
        return request<Area>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/areas`,
            data,
        })
    },
}
