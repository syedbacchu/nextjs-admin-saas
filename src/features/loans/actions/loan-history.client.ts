'use client'

import {
    getLoanPaymentHistoryAction,
    getEmployeeLoanHistoryAction,
} from '@/features/loans/actions/loan-history.actions'
import { LoanPaymentHistoryResponse, EmployeeLoanHistoryResponse } from '@/features/loans/loan-history.types'

export async function getLoanPaymentHistoryClient(
    tenantSlug: string,
    loanId: number | string,
): Promise<LoanPaymentHistoryResponse> {
    return getLoanPaymentHistoryAction(tenantSlug, loanId)
}

export async function getEmployeeLoanHistoryClient(
    tenantSlug: string,
    employeeId: number | string,
): Promise<EmployeeLoanHistoryResponse> {
    return getEmployeeLoanHistoryAction(tenantSlug, employeeId)
}
