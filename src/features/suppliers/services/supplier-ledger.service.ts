import { request } from '@/lib/http/request'
import {
    SupplierLedgerListData,
    SupplierLedgerListResponse,
} from '@/features/suppliers/supplier-ledger.types'

export const SupplierLedgerService = {
    list(tenantSlug: string, page: number = 1, search: string = '', filters?: Record<string, string>): Promise<SupplierLedgerListResponse> {
        const params = new URLSearchParams({
            page: String(page),
            per_page: '10',
            search: search || '',
        })

        if (filters?.supplier_id) params.append('supplier_id', filters.supplier_id)
        if (filters?.type) params.append('type', filters.type)
        if (filters?.from_date) params.append('purchase_date_from', filters.from_date)
        if (filters?.to_date) params.append('purchase_date_to', filters.to_date)
        if (filters?.orderBy) params.append('orderBy', filters.orderBy)
        if (filters?.orderColumn) params.append('orderColumn', filters.orderColumn)

        return request<SupplierLedgerListData>({
            method: 'GET',
            url: `/tenant/${encodeURIComponent(tenantSlug)}/supplier-ledger`,
            params: Object.fromEntries(params),
        })
    },
}
