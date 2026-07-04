import { request } from '@/lib/http/request'
import type {
  CreateDriverPaymentRequest,
  DriverPaymentListResponse,
  DriverPayment,
} from '@/features/driver-payment'

export async function getDriverPaymentSummariesClient(
  tenantSlug: string,
  queryParams?: string,
): Promise<{
  success: boolean
  message: string
  data?: DriverPaymentListResponse
}> {
  return request<DriverPaymentListResponse>({
    method: 'GET',
    url: `/tenant/${encodeURIComponent(tenantSlug)}/trip-driver-payments${queryParams ? '?' + queryParams : ''}`,
  })
}

export async function createDriverPaymentClient(
  tenantSlug: string,
  data: CreateDriverPaymentRequest,
): Promise<{
  success: boolean
  message: string
  data?: { payment: DriverPayment; amount: number }
}> {
  const formData = new FormData()
  formData.append('driver_id', String(data.driver_id))
  formData.append('office_id', String(data.office_id))
  formData.append('amount', String(data.amount))
  formData.append('payment_method', data.payment_method)
  if (data.note) formData.append('note', data.note)
  if (data.bill_document) formData.append('bill_document', data.bill_document)
  if (data.bill_ref) formData.append('bill_ref', data.bill_ref)
  if (data.date) formData.append('date', data.date)

  return request({
    method: 'POST',
    url: `/tenant/${encodeURIComponent(tenantSlug)}/trip-driver-payments`,
    data: formData,
  })
}

export async function getDriverPaymentHistoryClient(
  tenantSlug: string,
  driverId: number,
): Promise<{
  success: boolean
  message: string
  data?: DriverPayment[]
}> {
  return request<DriverPayment[]>({
    method: 'GET',
    url: `/tenant/${encodeURIComponent(tenantSlug)}/trip-driver-payments/${driverId}/history`,
  })
}

export async function deleteDriverPaymentHistoryClient(
  tenantSlug: string,
  driverId: number,
  paymentId: number,
): Promise<{
  success: boolean
  message: string
}> {
  return request({
    method: 'DELETE',
    url: `/tenant/${encodeURIComponent(tenantSlug)}/trip-driver-payments/${driverId}/history/${paymentId}`,
  })
}
