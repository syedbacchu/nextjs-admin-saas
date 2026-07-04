'use server'

import { LoanService } from '@/features/loans'
import { LoanPaymentHistoryResponse, EmployeeLoanHistoryResponse } from '@/features/loans/loan-history.types'

export async function getLoanPaymentHistoryAction(
    tenantSlug: string,
    loanId: number | string,
): Promise<LoanPaymentHistoryResponse> {
    return LoanService.getPaymentHistory(tenantSlug, loanId)
}

export async function getEmployeeLoanHistoryAction(
    tenantSlug: string,
    employeeId: number | string,
): Promise<EmployeeLoanHistoryResponse> {
    return LoanService.getEmployeeLoanHistory(tenantSlug, employeeId)
}
