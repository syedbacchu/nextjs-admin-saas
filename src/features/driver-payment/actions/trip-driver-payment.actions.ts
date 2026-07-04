'use server'

import {
  DriverPaymentListResponse,
  DriverPayment,
  CreateDriverPaymentRequest, getDriverPaymentSummariesClient, createDriverPaymentClient, getDriverPaymentHistoryClient,
} from '@/features/driver-payment'

export async function getDriverPaymentSummariesAction(
  tenantSlug: string,
  queryParams?: string,
): Promise<{
  success: boolean
  message: string
  data?: DriverPaymentListResponse
}> {
  try {
    const result = await getDriverPaymentSummariesClient(tenantSlug, queryParams)
    return result
  } catch (error) {
    console.error('Error in getDriverPaymentSummariesAction:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      success: false,
      message: `Failed to fetch driver payment summaries: ${errorMessage}`,
    }
  }
}

export async function createDriverPaymentAction(
  tenantSlug: string,
  data: CreateDriverPaymentRequest,
): Promise<{
  success: boolean
  message: string
  data?: { payment: DriverPayment; amount: number }
}> {
  try {
    return await createDriverPaymentClient(tenantSlug, data)
  } catch (error) {
    console.error('Error in createDriverPaymentAction:', error)
    return {
      success: false,
      message: 'Failed to create driver payment',
    }
  }
}

export async function getDriverPaymentHistoryAction(
  tenantSlug: string,
  driverId: number,
): Promise<{
  success: boolean
  message: string
  data?: DriverPayment[]
}> {
  try {
    const result = await getDriverPaymentHistoryClient(tenantSlug, driverId)

    if (result.success && result.data) {
      return {
        success: true,
        message: result.message,
        data: result.data,
      }
    }

    return result
  } catch (error) {
    console.error('Error in getDriverPaymentHistoryAction:', error)
    return {
      success: false,
      message: 'Failed to fetch payment history',
    }
  }
}
