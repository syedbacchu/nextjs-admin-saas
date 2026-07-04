'use client'

import {
    createAttendanceAction,
    deleteAttendanceAction,
    updateAttendanceAction,
} from '@/features/attendances/actions/attendance.actions'
import { AttendanceMutationResponse } from '@/features/attendances/types'

export async function createAttendanceClient(
    tenantSlug: string,
    formData: FormData,
): Promise<AttendanceMutationResponse> {
    return createAttendanceAction(tenantSlug, formData)
}

export async function updateAttendanceClient(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<AttendanceMutationResponse> {
    return updateAttendanceAction(tenantSlug, id, formData)
}

export async function deleteAttendanceClient(
    tenantSlug: string,
    id: number | string,
): Promise<AttendanceMutationResponse> {
    return deleteAttendanceAction(tenantSlug, id)
}
