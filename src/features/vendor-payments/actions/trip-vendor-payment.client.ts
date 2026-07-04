import { request } from '@/lib/http/request'
import {
  CreateVendorPaymentRequest, VendorPaymentHistory,
  VendorPaymentListResponse
} from "@/features/vendor-payments/types/trip-vendor-payment.types";

export async function getVendorPaymentSummariesClient(
  tenantSlug: string,
  queryParams?: string,
): Promise<{
  success: boolean
  message: string
  data?: VendorPaymentListResponse
}> {
  return request<VendorPaymentListResponse>({
    method: 'GET',
    url: `/tenant/${encodeURIComponent(tenantSlug)}/trip-vendor-payments${queryParams ? '?' + queryParams : ''}`,
  })
}

export async function createVendorPaymentClient(
  tenantSlug: string,
  data: CreateVendorPaymentRequest,
): Promise<{
  success: boolean
  message: string
  data?: { payment: VendorPaymentHistory; amount: number }
}> {
  const formData = new FormData()
  formData.append('vendor_id', String(data.vendor_id))
  formData.append('office_id', String(data.office_id))
  formData.append('amount', String(data.amount))
  formData.append('payment_method', data.payment_method)
  if (data.note) formData.append('note', data.note)
  if (data.bill_document) formData.append('bill_document', data.bill_document)
  if (data.bill_ref) formData.append('bill_ref', data.bill_ref)
  if (data.date) formData.append('date', data.date)

  return request({
    method: 'POST',
    url: `/tenant/${encodeURIComponent(tenantSlug)}/trip-vendor-payments`,
    data: formData,
  })
}

export async function getVendorPaymentHistoryClient(
  tenantSlug: string,
  vendorId: number,
): Promise<{
  success: boolean
  message: string
  data?: VendorPaymentHistory[]
}> {
  return request<VendorPaymentHistory[]>({
    method: 'GET',
    url: `/tenant/${encodeURIComponent(tenantSlug)}/trip-vendor-payments/${vendorId}/history`,
  })
}

export async function deleteVendorPaymentHistoryClient(
  tenantSlug: string,
  vendorId: number,
  paymentId: number,
): Promise<{
  success: boolean
  message: string
}> {
  return request({
    method: 'DELETE',
    url: `/tenant/${encodeURIComponent(tenantSlug)}/trip-vendor-payments/${vendorId}/history/${paymentId}`,
  })
}
