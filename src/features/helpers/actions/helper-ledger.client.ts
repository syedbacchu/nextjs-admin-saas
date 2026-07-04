import { request } from '@/lib/http/request'
import {
  HelperLedgerListData,
  SupervisorLedgerListData,
  EmployeeLedgerListData,
} from './helper-ledger.types'

export const getHelperLedgerClient = (
  tenantSlug: string,
  queryParams?: string
): Promise<{ success: boolean; message: string; data?: HelperLedgerListData }> => {
  return request<HelperLedgerListData>({
    method: 'GET',
    url: `/tenant/${encodeURIComponent(tenantSlug)}/monthly-helper-ledger${queryParams ? `?${queryParams}` : ''}`,
  })
}

export const getSupervisorLedgerClient = (
  tenantSlug: string,
  queryParams?: string
): Promise<{ success: boolean; message: string; data?: SupervisorLedgerListData }> => {
  return request<SupervisorLedgerListData>({
    method: 'GET',
    url: `/tenant/${encodeURIComponent(tenantSlug)}/monthly-supervisor-ledger${queryParams ? `?${queryParams}` : ''}`,
  })
}

export const getEmployeeLedgerClient = (
  tenantSlug: string,
  queryParams?: string
): Promise<{ success: boolean; message: string; data?: EmployeeLedgerListData }> => {
  return request<EmployeeLedgerListData>({
    method: 'GET',
    url: `/tenant/${encodeURIComponent(tenantSlug)}/monthly-employee-ledger${queryParams ? `?${queryParams}` : ''}`,
  })
}
