'use client'

import {
    createLoanAction,
    deleteLoanAction,
    updateLoanAction,
    LoanMutationResponse
} from '@/features/loans'

export async function createLoanClient(
    tenantSlug: string,
    formData: FormData,
): Promise<LoanMutationResponse> {
    return createLoanAction(tenantSlug, formData)
}

export async function updateLoanClient(
    tenantSlug: string,
    id: number | string,
    formData: FormData,
): Promise<LoanMutationResponse> {
    return updateLoanAction(tenantSlug, id, formData)
}

export async function deleteLoanClient(
    tenantSlug: string,
    id: number | string,
): Promise<LoanMutationResponse> {
    return deleteLoanAction(tenantSlug, id)
}
