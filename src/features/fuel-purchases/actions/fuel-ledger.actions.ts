'use server'

import { revalidatePath } from 'next/cache'
import {FuelLedgerListFilters, FuelLedgerListResponse} from "@/features/fuel-purchases";
import {FuelLedgerService} from "@/features/fuel-purchases/services/fuel-ledger.service";

export async function getFuelLedgerAction(
  tenantSlug: string,
  page: number,
  search: string,
  filters?: FuelLedgerListFilters,
): Promise<FuelLedgerListResponse> {
  return FuelLedgerService.list(tenantSlug, page, search, filters)
}
