'use server'

import {SupplierLedgerService} from "@/features/suppliers/services/supplier-ledger.service";

export async function getSupplierLedgerAction(
    tenantSlug: string,
    page: number = 1,
    search: string = '',
    filters?: Record<string, string>
) {
    try {
        return await SupplierLedgerService.list(tenantSlug, page, search, filters)
    } catch (error) {
        console.error('Error fetching supplier ledger:', error)
        return {
            success: false,
            message: 'Failed to fetch supplier ledger',
            data: undefined,
        }
    }
}
