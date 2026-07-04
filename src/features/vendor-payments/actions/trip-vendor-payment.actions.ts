'use server'

import {
  getVendorPaymentSummariesClient,
  createVendorPaymentClient,
  getVendorPaymentHistoryClient,
} from '@/features/vendor-payments/actions/trip-vendor-payment.client'
import {
  CreateVendorPaymentRequest, VendorPaymentHistory,
  VendorPaymentListResponse
} from "@/features/vendor-payments/types/trip-vendor-payment.types";


export async function getVendorPaymentSummariesAction(
  tenantSlug: string,
  queryParams?: string,
): Promise<{
  success: boolean
  message: string
  data?: VendorPaymentListResponse
}> {
  try {
    return await getVendorPaymentSummariesClient(tenantSlug, queryParams)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      success: false,
      message: `Failed to fetch vendor payment summaries: ${errorMessage}`,
    }
  }
}

export async function createVendorPaymentAction(
  tenantSlug: string,
  data: CreateVendorPaymentRequest,
): Promise<{
  success: boolean
  message: string
  data?: { payment: VendorPaymentHistory; amount: number }
}> {
  try {
    return await createVendorPaymentClient(tenantSlug, data)
  } catch {
    return {
      success: false,
      message: 'Failed to create vendor payment',
    }
  }
}

export async function getVendorPaymentHistoryAction(
  tenantSlug: string,
  vendorId: number,
): Promise<{
  success: boolean
  message: string
  data?: VendorPaymentHistory[]
}> {
  try {
    return await getVendorPaymentHistoryClient(tenantSlug, vendorId)
  } catch {
    return {
      success: false,
      message: 'Failed to fetch payment history',
    }
  }
}
