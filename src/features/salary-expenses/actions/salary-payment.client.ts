'use client'

import type {
    GeneratedSalaryListResponse,
    GeneratedSalarySingleResponse,
    PayableAmountResponse,
    PaymentHistoryResponse,
    EmployeePaymentHistoryResponse,
    SalaryPaymentMutationResponse,
    CreateSalaryPaymentRequest,
} from "@/features/salary-expenses/salary-payment.types";
import {SalaryPaymentService} from "@/features/salary-expenses/services/salary-payment.service";

export async function getGeneratedSalaryListClient(
    tenantSlug: string,
    page: number = 1,
    search: string = ''
): Promise<GeneratedSalaryListResponse> {
    return SalaryPaymentService.generatedSalaryList(tenantSlug, page, search)
}

export async function getGeneratedSalaryClient(
    tenantSlug: string,
    id: number
): Promise<GeneratedSalarySingleResponse> {
    return SalaryPaymentService.generatedSalaryShow(tenantSlug, id)
}

export async function getSalarySheetClient(
    tenantSlug: string,
    id: number
): Promise<GeneratedSalarySingleResponse> {
    return SalaryPaymentService.salarySheet(tenantSlug, id)
}

export async function getPayableAmountClient(
    tenantSlug: string,
    salarySheetId: number
): Promise<PayableAmountResponse> {
    return SalaryPaymentService.getPayableAmount(tenantSlug, salarySheetId)
}

export async function processSalaryPaymentClient(
    tenantSlug: string,
    data: CreateSalaryPaymentRequest
): Promise<SalaryPaymentMutationResponse> {
    return SalaryPaymentService.processPayment(tenantSlug, data)
}

export async function getPaymentHistoryClient(
    tenantSlug: string,
    salarySheetId: number
): Promise<PaymentHistoryResponse> {
    return SalaryPaymentService.getPaymentHistory(tenantSlug, salarySheetId)
}

export async function getEmployeePaymentHistoryClient(
    tenantSlug: string,
    employeeId: number,
    month?: string
): Promise<EmployeePaymentHistoryResponse> {
    return SalaryPaymentService.getEmployeePaymentHistory(tenantSlug, employeeId, month)
}
