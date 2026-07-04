import { request } from '@/lib/http/request'
import {
    Employee,
    EmployeeAllResponse,
    EmployeeListData,
    EmployeeListResponse,
    EmployeeMutationResponse,
    EmployeeSingleResponse,
} from "@/features/employees"

export const EmployeeService = {
    list(tenantSlug: string, page: number = 1, search: string = ''): Promise<EmployeeListResponse> {
        return request<EmployeeListData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/employees`,
            params: { page, search },
        })
    },

    show(tenantSlug: string, id: number | string): Promise<EmployeeSingleResponse> {
        return request<Employee>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/employees/${id}`,
        })
    },

    create(tenantSlug: string, data: FormData): Promise<EmployeeMutationResponse> {
        return request<Employee>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/employees`,
            data,
        })
    },

    update(tenantSlug: string, id: number | string, data: FormData): Promise<EmployeeMutationResponse> {
        return request<Employee>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/employees/${id}`,
            data,
        })
    },

    delete(tenantSlug: string, id: number | string): Promise<EmployeeMutationResponse> {
        return request<unknown[]>({
            method: 'DELETE',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/employees/${id}`,
        })
    },

    getAll(tenantSlug: string): Promise<EmployeeAllResponse> {
        return request<Employee[]>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/all-employees`,
        })
    },
}
