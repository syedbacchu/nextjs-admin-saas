'use server'

import { getPaymentHistoryClient, getSupplierPaymentsClient } from '@/features/supplier-payments/actions/supplier-payment.client'
import type { PurchasePaymentHistory, SupplierPaymentListResponse } from '@/features/supplier-payments'

export async function getSupplierPaymentsAction(
    tenantSlug: string,
    queryParams?: string,
): Promise<{
    success: boolean
    message: string
    data?: SupplierPaymentListResponse
}> {
    try {
        return await getSupplierPaymentsClient(tenantSlug, queryParams)
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return {
            success: false,
            message: `Failed to fetch supplier payments: ${errorMessage}`,
        }
    }
}

export async function getPaymentHistoryAction(
    tenantSlug: string,
    type: string,
    purchaseId: number,
): Promise<{
    success: boolean
    message: string
    data?: PurchasePaymentHistory[]
}> {
    try {
        const result = await getPaymentHistoryClient(tenantSlug, type, purchaseId)
        if (result.success && result.data) {
            const transformedData = result.data.map((payment) => ({
                id: payment.id,
                type: payment.type,
                purchase_id: payment.purchase_id,
                supplier_id: payment.supplier_id,
                amount: payment.amount,
                payment_method: payment.payment_method,
                note: payment.note,
                attachment: payment.attachment,
                payment_date: payment.payment_date,
                status: payment.status,
                created_at: payment.created_at,
                updated_at: payment.updated_at,
                supplier: payment.supplier ? { id: payment.supplier.id, name: payment.supplier.name } : null,
            }))
            return { success: true, message: result.message, data: transformedData as PurchasePaymentHistory[] }
        }
        return result
    } catch {
        return {
            success: false,
            message: 'Failed to fetch payment history',
        }
    }
}
