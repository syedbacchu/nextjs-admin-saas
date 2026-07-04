import { request } from '@/lib/http/request'
import {
    Supervisor,
    SupervisorListData,
    SupervisorListResponse,
    SupervisorMutationResponse,
    SupervisorSingleResponse,
} from '@/features/supervisors'

export const SupervisorService = {
    list(tenantSlug: string, page: number = 1, search: string = ''): Promise<SupervisorListResponse> {
        return request<SupervisorListData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/supervisors`,
            params: { page, search },
        })
    },

    show(tenantSlug: string, id: number | string): Promise<SupervisorSingleResponse> {
        return request<Supervisor>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/supervisors/${id}`,
        })
    },

    create(tenantSlug: string, data: FormData): Promise<SupervisorMutationResponse> {
        return request<Supervisor>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/supervisors`,
            data,
        })
    },

    update(tenantSlug: string, id: number | string, data: FormData): Promise<SupervisorMutationResponse> {
        return request<Supervisor>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/supervisors/${id}`,
            data,
        })
    },

    delete(tenantSlug: string, id: number | string): Promise<SupervisorMutationResponse> {
        return request<unknown[]>({
            method: 'DELETE',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/supervisors/${id}`,
        })
    },
}
