import { request } from '@/lib/http/request'
import type {
    CreatePaymentRequest,
    CreatePaymentResponse,
    SupplierPaymentListResponse,
    PurchasePaymentHistory,
} from '@/features/supplier-payments'

export async function getSupplierPaymentsClient(
    tenantSlug: string,
    queryParams?: string,
): Promise<{
    success: boolean
    message: string
    data?: SupplierPaymentListResponse
}> {
    return request<SupplierPaymentListResponse>({
        method: 'GET',
        url: `/tenant/${encodeURIComponent(tenantSlug)}/supplier-payments${queryParams ? '?' + queryParams : ''}`,
    })
}

export async function createPurchasePaymentClient(
    tenantSlug: string,
    data: CreatePaymentRequest,
): Promise<{
    success: boolean
    message: string
    data?: CreatePaymentResponse
}> {
    const formData = new FormData()
    formData.append('type', data.type)
    formData.append('purchase_id', String(data.purchase_id))
    formData.append('amount', String(data.amount))
    formData.append('payment_method', data.payment_method)
    if (data.note) formData.append('note', data.note)
    if (data.attachment) formData.append('attachment', data.attachment)
    if (data.payment_date) formData.append('payment_date', data.payment_date)

    return request<CreatePaymentResponse>({
        method: 'POST',
        url: `/tenant/${encodeURIComponent(tenantSlug)}/supplier-payments`,
        data: formData,
    })
}

export async function getPaymentHistoryClient(
    tenantSlug: string,
    type: string,
    purchaseId: number,
): Promise<{
    success: boolean
    message: string
    data?: PurchasePaymentHistory[]
}> {
    return request<PurchasePaymentHistory[]>({
        method: 'GET',
        url: `/tenant/${encodeURIComponent(tenantSlug)}/supplier-payments/${type}/${purchaseId}/history`,
    })
}

export async function deletePaymentHistoryClient(
    tenantSlug: string,
    type: string,
    purchaseId: number,
    paymentId: number,
): Promise<{
    success: boolean
    message: string
}> {
    return request({
        method: 'DELETE',
        url: `/tenant/${encodeURIComponent(tenantSlug)}/supplier-payments/${type}/${purchaseId}/history/${paymentId}`,
    })
}
