import {FuelLedgerListFilters, FuelLedgerListResponse} from "@/features/fuel-purchases";

export const useFuelLedger = () => {
  const getFuelLedgerList = async (
    tenantSlug: string,
    page: number = 1,
    search: string = '',
    filters?: FuelLedgerListFilters,
  ): Promise<FuelLedgerListResponse> => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      ...(search && { search }),
      ...(filters?.vehicle_id && { vehicle_id: filters.vehicle_id }),
      ...(filters?.from_date && { from_date: filters.from_date }),
      ...(filters?.to_date && { to_date: filters.to_date }),
    })

    const response = await fetch(
      `${process.env.API_BASE_URL}/tenant/${tenantSlug}/fuel-ledger?${queryParams}`,
      {
        headers: {
          'Content-Type': 'application/json',
          userapisecret: process.env.API_USER_SECRET || '',
        },
        cache: 'no-store',
      },
    )

    return response.json()
  }

  return {
    getFuelLedgerList,
  }
}
