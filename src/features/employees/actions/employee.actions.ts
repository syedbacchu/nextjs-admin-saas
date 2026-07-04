'use server'

import { revalidatePath } from 'next/cache'
import {
    EmployeeAllResponse,
    EmployeeListResponse,
    EmployeeMutationResponse, EmployeeService,
    EmployeeSingleResponse,
} from '@/features/employees'

function revalidateEmployeePaths(tenantSlug: string) {
    revalidatePath(`/${tenantSlug}/employees`)
}

export async function getEmployeesAction(
    tenantSlug: string,
    page: number,
    search: string,
): Promise<EmployeeListResponse> {
    return EmployeeService.list(tenantSlug, page, search)
}

export async function getEmployeeAction(
    tenantSlug: string,
    id: number | string,
): Promise<EmployeeSingleResponse> {
    return EmployeeService.show(tenantSlug, id)
}

export async function createEmployeeAction(
    tenantSlug: string,
    formData: FormData,
): Promise<EmployeeMutationResponse> {
    const res = await EmployeeService.create(tenantSlug, formData)
    if (res.success) {
        revalidateEmployeePaths(tenantSlug)
    }
    return res
}

export async function updateEmployeeAction(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<EmployeeMutationResponse> {
    const res = await EmployeeService.update(tenantSlug, id, formData)
    if (res.success) {
        revalidateEmployeePaths(tenantSlug)
        revalidatePath(`/${tenantSlug}/employees/${id}`)
    }
    return res
}

export async function deleteEmployeeAction(
    tenantSlug: string,
    id: number | string,
): Promise<EmployeeMutationResponse> {
    const res = await EmployeeService.delete(tenantSlug, id)
    if (res.success) {
        revalidateEmployeePaths(tenantSlug)
    }
    return res
}

export async function getAllEmployeesAction(
    tenantSlug: string,
): Promise<EmployeeAllResponse> {
    return EmployeeService.getAll(tenantSlug)
}
