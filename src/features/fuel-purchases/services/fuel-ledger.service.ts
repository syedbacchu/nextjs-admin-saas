import { request } from '@/lib/http/request'
import {
  FuelLedgerListData,
  FuelLedgerListFilters,
  FuelLedgerListResponse,
} from '@/features/fuel-purchases'

export const FuelLedgerService = {
  list(
    tenantSlug: string,
    page: number = 1,
    search: string = '',
    filters?: FuelLedgerListFilters,
  ): Promise<FuelLedgerListResponse> {
    const params: Record<string, string | number> = { page, search }

    if (filters?.vehicle_id) {
      params.vehicle_id = filters.vehicle_id
    }
    if (filters?.from_date) {
      params.from_date = filters.from_date
    }
    if (filters?.to_date) {
      params.to_date = filters.to_date
    }

    return request<FuelLedgerListData>({
      method: 'GET',
      url: `/tenant/${encodeURIComponent(tenantSlug)}/fuel-ledger`,
      params,
    })
  },
}
