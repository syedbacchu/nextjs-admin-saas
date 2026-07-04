'use server'

import {
  getHelperLedgerClient,
  getSupervisorLedgerClient,
  getEmployeeLedgerClient,
} from './helper-ledger.client'
import type {
  HelperLedgerListData,
  SupervisorLedgerListData,
  EmployeeLedgerListData,
} from "@/features/helpers"

export async function getHelperLedgerAction(
  tenantSlug: string,
  queryParams?: string
): Promise<{
  success: boolean
  message: string
  data?: HelperLedgerListData
}> {
  try {
    const result = await getHelperLedgerClient(tenantSlug, queryParams)
    return result
  } catch (error) {
    console.error('Error in getHelperLedgerAction:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      success: false,
      message: `Failed to fetch helper ledger: ${errorMessage}`,
    }
  }
}

export async function getSupervisorLedgerAction(
  tenantSlug: string,
  queryParams?: string
): Promise<{
  success: boolean
  message: string
  data?: SupervisorLedgerListData
}> {
  try {
    const result = await getSupervisorLedgerClient(tenantSlug, queryParams)
    return result
  } catch (error) {
    console.error('Error in getSupervisorLedgerAction:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      success: false,
      message: `Failed to fetch supervisor ledger: ${errorMessage}`,
    }
  }
}

export async function getEmployeeLedgerAction(
  tenantSlug: string,
  queryParams?: string
): Promise<{
  success: boolean
  message: string
  data?: EmployeeLedgerListData
}> {
  try {
    const result = await getEmployeeLedgerClient(tenantSlug, queryParams)
    return result
  } catch (error) {
    console.error('Error in getEmployeeLedgerAction:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      success: false,
      message: `Failed to fetch employee ledger: ${errorMessage}`,
    }
  }
}
