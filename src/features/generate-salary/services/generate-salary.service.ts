import { request } from '@/lib/http/request'
import {GenerateSalaryResponse} from "@/features/generate-salary";

export const GenerateSalaryService = {
    create(tenantSlug: string, data: FormData): Promise<GenerateSalaryResponse> {
        return request({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/generate-salaries`,
            data,
        })
    },

    delete(tenantSlug: string, id: number): Promise<GenerateSalaryResponse> {
        return request({
            method: 'DELETE',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/generate-salaries/${id}`,
        })
    },
}
