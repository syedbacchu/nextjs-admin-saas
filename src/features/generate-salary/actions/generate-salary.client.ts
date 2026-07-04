'use client'


import {GenerateSalaryResponse, GenerateSalaryService} from "@/features/generate-salary";

export async function processGenerateSalaryClient(
    tenantSlug: string,
    formData: FormData
): Promise<GenerateSalaryResponse> {
    return GenerateSalaryService.create(tenantSlug, formData)
}

export async function deleteGeneratedSalaryClient(
    tenantSlug: string,
    id: number
): Promise<GenerateSalaryResponse> {
    return GenerateSalaryService.delete(tenantSlug, id)
}
