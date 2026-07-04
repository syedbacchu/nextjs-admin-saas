'use server'

import { revalidatePath } from 'next/cache'
import { AttendanceService } from '@/features/attendances/services/attendance.service'
import {
    AttendanceListResponse,
    AttendanceMutationResponse,
    AttendanceSingleResponse,
} from '@/features/attendances'

function revalidateAttendancePaths(tenantSlug: string) {
    revalidatePath(`/${tenantSlug}/attendances`)
}

export async function getAttendancesAction(
    tenantSlug: string,
    page: number,
    search: string,
    filters?: {
        employee_id?: string
        month?: string
    },
): Promise<AttendanceListResponse> {
    return AttendanceService.list(tenantSlug, page, search, filters)
}

export async function getAttendanceAction(
    tenantSlug: string,
    id: number | string,
): Promise<AttendanceSingleResponse> {
    return AttendanceService.show(tenantSlug, id)
}

export async function createAttendanceAction(
    tenantSlug: string,
    formData: FormData,
): Promise<AttendanceMutationResponse> {
    const res = await AttendanceService.create(tenantSlug, formData)
    if (res.success) {
        revalidateAttendancePaths(tenantSlug)
    }
    return res
}

export async function updateAttendanceAction(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<AttendanceMutationResponse> {
    const res = await AttendanceService.update(tenantSlug, id, formData)
    if (res.success) {
        revalidateAttendancePaths(tenantSlug)
        revalidatePath(`/${tenantSlug}/attendances/${id}`)
    }
    return res
}

export async function deleteAttendanceAction(
    tenantSlug: string,
    id: number | string,
): Promise<AttendanceMutationResponse> {
    const res = await AttendanceService.delete(tenantSlug, id)
    if (res.success) {
        revalidateAttendancePaths(tenantSlug)
    }
    return res
}
