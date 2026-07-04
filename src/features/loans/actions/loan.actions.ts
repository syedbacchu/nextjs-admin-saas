'use server'

import { revalidatePath } from 'next/cache'
import {
    LoanListResponse,
    LoanMutationResponse,
    LoanSingleResponse,
    LoanService
} from '@/features/loans'

export async function getLoansAction(
    tenantSlug: string,
    page: number,
    search: string,
    filters?: {
        employee_id?: string
        office_id?: string
    },
): Promise<LoanListResponse> {
    return LoanService.list(tenantSlug, page, search, filters)
}

export async function getLoanAction(
    tenantSlug: string,
    id: number | string,
): Promise<LoanSingleResponse> {
    return LoanService.show(tenantSlug, id)
}

export async function createLoanAction(
    tenantSlug: string,
    formData: FormData,
): Promise<LoanMutationResponse> {
    const res = await LoanService.create(tenantSlug, formData)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/loans`)
    }
    return res
}

export async function updateLoanAction(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<LoanMutationResponse> {
    const res = await LoanService.update(tenantSlug, id, formData)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/loans`)
        revalidatePath(`/${tenantSlug}/loans/${id}`)
    }
    return res
}

export async function deleteLoanAction(
    tenantSlug: string,
    id: number | string,
): Promise<LoanMutationResponse> {
    const res = await LoanService.delete(tenantSlug, id)
    if (res.success) {
        revalidatePath(`/${tenantSlug}/loans`)
    }
    return res
}
