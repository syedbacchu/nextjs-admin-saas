import { request } from '@/lib/http/request'
import {
    Attendance,
    AttendanceListData,
    AttendanceListResponse,
    AttendanceMutationResponse,
    AttendanceSingleResponse,
} from '@/features/attendances'

export const AttendanceService = {
    list(tenantSlug: string, page: number = 1, search: string = '', filters?: {
        employee_id?: string
        month?: string
    }): Promise<AttendanceListResponse> {
        return request<AttendanceListData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/payroll-attendances`,
            params: {
                page,
                search,
                ...(filters?.employee_id && { employee_id: filters.employee_id }),
                ...(filters?.month && { month: filters.month }),
            },
        })
    },

    show(tenantSlug: string, id: number | string): Promise<AttendanceSingleResponse> {
        return request<Attendance>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/payroll-attendances/${id}`,
        })
    },

    create(tenantSlug: string, data: FormData): Promise<AttendanceMutationResponse> {
        return request<Attendance>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/payroll-attendances`,
            data,
        })
    },

    update(tenantSlug: string, id: number | string, data: FormData): Promise<AttendanceMutationResponse> {
        return request<Attendance>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/payroll-attendances/${id}`,
            data,
        })
    },

    delete(tenantSlug: string, id: number | string): Promise<AttendanceMutationResponse> {
        return request<unknown[]>({
            method: 'DELETE',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/payroll-attendances/${id}`,
        })
    },
}
