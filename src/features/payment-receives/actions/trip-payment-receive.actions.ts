'use server'

import {
  getCustomerPaymentSummariesClient,
  createCustomerPaymentReceiveClient,
  getCustomerPaymentHistoryClient,
} from '@/features/payment-receives/actions/trip-payment-receive.client'
import {
  CreateCustomerPaymentReceiveRequest,
  CustomerPaymentListResponse,
  CustomerPaymentReceive
} from "@/features/payment-receives/trip-payment-receive.types";


export async function getCustomerPaymentSummariesAction(
  tenantSlug: string,
  queryParams?: string,
): Promise<{
  success: boolean
  message: string
  data?: CustomerPaymentListResponse
}> {
  try {
    const result = await getCustomerPaymentSummariesClient(tenantSlug, queryParams)
    return result
  } catch (error) {
    console.error('Error in getCustomerPaymentSummariesAction:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      success: false,
      message: `Failed to fetch customer payment summaries: ${errorMessage}`,
    }
  }
}

export async function createCustomerPaymentReceiveAction(
  tenantSlug: string,
  data: CreateCustomerPaymentReceiveRequest,
): Promise<{
  success: boolean
  message: string
  data?: { payment: CustomerPaymentReceive; amount: number }
}> {
  try {
    return await createCustomerPaymentReceiveClient(tenantSlug, data)
  } catch (error) {
    console.error('Error in createCustomerPaymentReceiveAction:', error)
    return {
      success: false,
      message: 'Failed to create payment receive',
    }
  }
}

export async function getCustomerPaymentHistoryAction(
  tenantSlug: string,
  customerId: number,
): Promise<{
  success: boolean
  message: string
  data?: CustomerPaymentReceive[]
}> {
  try {
    const result = await getCustomerPaymentHistoryClient(tenantSlug, customerId)

    if (result.success && result.data) {
      return {
        success: true,
        message: result.message,
        data: result.data,
      }
    }

    return result
  } catch (error) {
    console.error('Error in getCustomerPaymentHistoryAction:', error)
    return {
      success: false,
      message: 'Failed to fetch payment history',
    }
  }
}
