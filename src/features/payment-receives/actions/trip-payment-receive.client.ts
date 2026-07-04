import { request } from '@/lib/http/request'
import {
  CreateCustomerPaymentReceiveRequest,
  CustomerPaymentListResponse, CustomerPaymentReceive
} from "@/features/payment-receives/trip-payment-receive.types";


export async function getCustomerPaymentSummariesClient(
  tenantSlug: string,
  queryParams?: string,
): Promise<{
  success: boolean
  message: string
  data?: CustomerPaymentListResponse
}> {
  return request<CustomerPaymentListResponse>({
    method: 'GET',
    url: `/tenant/${encodeURIComponent(tenantSlug)}/trip-payment-receives${queryParams ? '?' + queryParams : ''}`,
  })
}

export async function createCustomerPaymentReceiveClient(
  tenantSlug: string,
  data: CreateCustomerPaymentReceiveRequest,
): Promise<{
  success: boolean
  message: string
  data?: { payment: CustomerPaymentReceive; amount: number }
}> {
  const formData = new FormData()
  formData.append('customer_id', String(data.customer_id))
  formData.append('office_id', String(data.office_id))
  formData.append('amount', String(data.amount))
  formData.append('cash_type', data.cash_type)
  if (data.note) formData.append('note', data.note)
  if (data.bill_ref) formData.append('bill_ref', data.bill_ref)
  if (data.bill_document) formData.append('bill_document', data.bill_document)
  if (data.date) formData.append('date', data.date)

  return request({
    method: 'POST',
    url: `/tenant/${encodeURIComponent(tenantSlug)}/trip-payment-receives`,
    data: formData,
  })
}

export async function getCustomerPaymentHistoryClient(
  tenantSlug: string,
  customerId: number,
): Promise<{
  success: boolean
  message: string
  data?: CustomerPaymentReceive[]
}> {
  return request<CustomerPaymentReceive[]>({
    method: 'GET',
    url: `/tenant/${encodeURIComponent(tenantSlug)}/trip-payment-receives/${customerId}/history`,
  })
}

export async function deleteCustomerPaymentHistoryClient(
  tenantSlug: string,
  customerId: number,
  paymentId: number,
): Promise<{
  success: boolean
  message: string
}> {
  return request({
    method: 'DELETE',
    url: `/tenant/${encodeURIComponent(tenantSlug)}/trip-payment-receives/${customerId}/history/${paymentId}`,
  })
}
