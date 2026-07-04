'use server'

import { SalaryPaymentService } from '@/features/salary-expenses/services/salary-payment.service'
import {
    EmployeePaymentHistoryResponse,
    GeneratedSalaryListResponse,
    GeneratedSalarySingleResponse, PayableAmountResponse, PaymentHistoryResponse, SalaryPaymentMutationResponse
} from "@/features/salary-expenses/salary-payment.types";


export async function getGeneratedSalaryListAction(
    tenantSlug: string,
    page: number = 1,
    search: string = ''
): Promise<GeneratedSalaryListResponse> {
    return SalaryPaymentService.generatedSalaryList(tenantSlug, page, search)
}

export async function getGeneratedSalaryAction(
    tenantSlug: string,
    id: number
): Promise<GeneratedSalarySingleResponse> {
    return SalaryPaymentService.generatedSalaryShow(tenantSlug, id)
}

export async function getSalarySheetAction(
    tenantSlug: string,
    id: number
): Promise<GeneratedSalarySingleResponse> {
    return SalaryPaymentService.salarySheet(tenantSlug, id)
}

export async function getPayableAmountAction(
    tenantSlug: string,
    salarySheetId: number
): Promise<PayableAmountResponse> {
    return SalaryPaymentService.getPayableAmount(tenantSlug, salarySheetId)
}

export async function processSalaryPaymentAction(
    tenantSlug: string,
    formData: FormData
): Promise<SalaryPaymentMutationResponse> {
    const data = {
        salary_sheet_id: Number(formData.get('salary_sheet_id')),
        payment_amount: Number(formData.get('payment_amount')),
        payment_date: formData.get('payment_date') as string | undefined,
        office_id: Number(formData.get('office_id')),
        payment_method: formData.get('payment_method') as string | undefined,
        transaction_id: formData.get('transaction_id') as string | undefined,
        remarks: formData.get('remarks') as string | undefined,
        attachment: formData.get('attachment') as string | undefined,
        status: formData.get('status') ? Number(formData.get('status')) : undefined,
    }

    return SalaryPaymentService.processPayment(tenantSlug, data)
}

export async function getPaymentHistoryAction(
    tenantSlug: string,
    salarySheetId: number
): Promise<PaymentHistoryResponse> {
    return SalaryPaymentService.getPaymentHistory(tenantSlug, salarySheetId)
}

export async function getEmployeePaymentHistoryAction(
    tenantSlug: string,
    employeeId: number,
    month?: string
): Promise<EmployeePaymentHistoryResponse> {
    return SalaryPaymentService.getEmployeePaymentHistory(tenantSlug, employeeId, month)
}

export async function exportSalarySheetPdfAction(
    tenantSlug: string,
    id: number
): Promise<{ success: boolean; message: string; fileData?: string; filename?: string; error?: string }> {
    try {
        const result = await SalaryPaymentService.exportSalarySheetPdf(tenantSlug, id)
        return result
    } catch (error: any) {
        console.error('Error exporting PDF:', error)
        return {
            success: false,
            message: 'Failed to export PDF',
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}

export async function exportSalarySheetExcelAction(
    tenantSlug: string,
    id: number
): Promise<{ success: boolean; message: string; fileData?: string; filename?: string; error?: string }> {
    try {
        const result = await SalaryPaymentService.exportSalarySheetExcel(tenantSlug, id)
        return result
    } catch (error: any) {
        console.error('Error exporting Excel:', error)
        return {
            success: false,
            message: 'Failed to export Excel',
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}
