'use client'



import {
    EmployeeMutationResponse,
    createEmployeeAction,
    updateEmployeeAction,
    deleteEmployeeAction,
    EmployeeAllResponse,
    getAllEmployeesAction
} from "@/features/employees";

export async function createEmployeeClient(
    tenantSlug: string,
    formData: FormData,
): Promise<EmployeeMutationResponse> {
    return createEmployeeAction(tenantSlug, formData)
}

export async function updateEmployeeClient(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<EmployeeMutationResponse> {
    return updateEmployeeAction(tenantSlug, id, formData)
}

export async function deleteEmployeeClient(
    tenantSlug: string,
    id: number | string,
): Promise<EmployeeMutationResponse> {
    return deleteEmployeeAction(tenantSlug, id)
}

export async function getAllEmployeesClient(
    tenantSlug: string,
): Promise<EmployeeAllResponse> {
    return getAllEmployeesAction(tenantSlug)
}
