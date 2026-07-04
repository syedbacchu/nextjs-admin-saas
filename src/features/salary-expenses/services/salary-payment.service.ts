import { request } from '@/lib/http/request'
import {SalaryPayment,
    PayableAmount,
    PaymentHistory,
    EmployeePaymentHistory,
    GeneratedSalary,
    GeneratedSalaryListData,
    GeneratedSalaryListResponse,
    GeneratedSalarySingleResponse,
    PayableAmountResponse,
    PaymentHistoryResponse,
    EmployeePaymentHistoryResponse,
    SalaryPaymentMutationResponse,
    CreateSalaryPaymentRequest,} from "@/features/salary-expenses/salary-payment.types";

export const SalaryPaymentService = {
    generatedSalaryList(
        tenantSlug: string,
        page: number = 1,
        search: string = ''
    ): Promise<GeneratedSalaryListResponse> {
        return request<GeneratedSalaryListData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/generate-salaries`,
            params: {
                page,
                search,
            },
        })
    },

    generatedSalaryShow(tenantSlug: string, id: number): Promise<GeneratedSalarySingleResponse> {
        return request<GeneratedSalary>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/generate-salaries/${id}`,
        })
    },

    salarySheet(tenantSlug: string, id: number): Promise<GeneratedSalarySingleResponse> {
        return request<GeneratedSalary>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/generate-salaries/${id}/salary-sheet`,
        })
    },

    getPayableAmount(tenantSlug: string, salarySheetId: number): Promise<PayableAmountResponse> {
        return request<PayableAmount>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/salary-payments/${salarySheetId}/payable`,
        })
    },

    processPayment(
        tenantSlug: string,
        data: CreateSalaryPaymentRequest
    ): Promise<SalaryPaymentMutationResponse> {
        const formData = new FormData()
        formData.append('salary_sheet_id', String(data.salary_sheet_id))
        formData.append('payment_amount', String(data.payment_amount))
        formData.append('office_id', String(data.office_id))

        if (data.payment_date) {
            formData.append('payment_date', data.payment_date)
        }
        if (data.payment_method) {
            formData.append('payment_method', data.payment_method)
        }
        if (data.transaction_id) {
            formData.append('transaction_id', data.transaction_id)
        }
        if (data.remarks) {
            formData.append('remarks', data.remarks)
        }
        if (data.attachment) {
            formData.append('attachment', data.attachment)
        }
        if (typeof data.status !== 'undefined') {
            formData.append('status', String(data.status))
        }

        return request<SalaryPayment>({
            method: 'POST',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/salary-payments/process`,
            data: formData,
        })
    },

    getPaymentHistory(tenantSlug: string, salarySheetId: number): Promise<PaymentHistoryResponse> {
        return request<PaymentHistory>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/salary-payments/${salarySheetId}/history`,
        })
    },

    getEmployeePaymentHistory(
        tenantSlug: string,
        employeeId: number,
        month?: string
    ): Promise<EmployeePaymentHistoryResponse> {
        const params = month ? { month } : {}
        return request<EmployeePaymentHistory>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/salary-payments/employee/${employeeId}/history`,
            params,
        })
    },

    async exportSalarySheetPdf(tenantSlug: string, id: number): Promise<{ success: boolean; message: string; fileData?: string; filename?: string }> {
        try {
            const { apiFetchServer } = await import('@/lib/http/fetch-server')
            const response = await apiFetchServer({
                method: 'GET',
                url: `/tenant/${encodeURIComponent(tenantSlug)}/generate-salaries/${id}/export/pdf`,
            })

            if (!response.ok) {
                return {
                    success: false,
                    message: `Failed to export PDF: ${response.status} ${response.statusText}`,
                }
            }

            const blob = await response.blob()
            if (blob.size === 0) {
                return {
                    success: false,
                    message: 'Received empty file',
                }
            }

            const arrayBuffer = await blob.arrayBuffer()
            const bytes = new Uint8Array(arrayBuffer)
            let binary = ''
            for (let i = 0; i < bytes.length; i++) {
                binary += String.fromCharCode(bytes[i])
            }
            const base64 = btoa(binary)
            const filename = `salary-sheet-${id}-${new Date().toISOString().split('T')[0]}.pdf`

            return {
                success: true,
                message: 'PDF exported successfully',
                fileData: `data:application/pdf;base64,${base64}`,
                filename: filename
            }
        } catch (error: any) {
            console.error('Error exporting PDF:', error)
            return {
                success: false,
                message: 'Error exporting PDF',
            }
        }
    },

    async exportSalarySheetExcel(tenantSlug: string, id: number): Promise<{ success: boolean; message: string; fileData?: string; filename?: string }> {
        try {
            const { apiFetchServer } = await import('@/lib/http/fetch-server')
            const response = await apiFetchServer({
                method: 'GET',
                url: `/tenant/${encodeURIComponent(tenantSlug)}/generate-salaries/${id}/export/excel`,
            })

            if (!response.ok) {
                return {
                    success: false,
                    message: `Failed to export Excel: ${response.status} ${response.statusText}`,
                }
            }

            const blob = await response.blob()
            if (blob.size === 0) {
                return {
                    success: false,
                    message: 'Received empty file',
                }
            }

            const arrayBuffer = await blob.arrayBuffer()
            const bytes = new Uint8Array(arrayBuffer)
            let binary = ''
            for (let i = 0; i < bytes.length; i++) {
                binary += String.fromCharCode(bytes[i])
            }
            const base64 = btoa(binary)
            const filename = `salary-sheet-${id}-${new Date().toISOString().split('T')[0]}.xlsx`

            return {
                success: true,
                message: 'Excel exported successfully',
                fileData: `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`,
                filename: filename
            }
        } catch (error: any) {
            console.error('Error exporting Excel:', error)
            return {
                success: false,
                message: 'Error exporting Excel',
            }
        }
    },
}
