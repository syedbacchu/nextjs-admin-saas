'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import DynamicTable from '@/components/ui/DynamicTable'
import { deleteVendorPaymentClient, getVendorPaymentsAction, VendorPaymentListResponse } from '@/features/vendor-payments'
import { useVendorPaymentColumns } from '@/features/vendor-payments/hooks/useVendorPaymentColumns'

const EMPTY_VENDOR_PAYMENT_LIST: VendorPaymentListResponse = {
    success: false,
    message: 'Invalid tenant',
    status: 400,
    error_message: '',
    data: {
        total_count: 0,
        total_page: 1,
        per_page: 20,
        current_page: 1,
        data: [],
    },
}

export default function VendorPaymentsListPage() {
    const router = useRouter()
    const params = useParams<{ tenant_slug?: string }>()
    const tenantSlug = String(params?.tenant_slug || '').trim()
    const [refreshKey, setRefreshKey] = useState(0)

    async function handleDelete(id: number | string) {
        if (!tenantSlug) {
            toast.error('Invalid tenant')
            return
        }

        const res = await deleteVendorPaymentClient(tenantSlug, id)
        if (res.success) {
            toast.success(res.message || 'Vendor payment deleted successfully')
            setRefreshKey((prev) => prev + 1)
        } else {
            toast.error(res.message || 'Failed to delete vendor payment')
        }
    }

    const columns = useVendorPaymentColumns(tenantSlug, handleDelete)

    async function fetchVendorPayments(page: number, search: string) {
        if (!tenantSlug) return EMPTY_VENDOR_PAYMENT_LIST
        return getVendorPaymentsAction(tenantSlug, page, search)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Vendor Payment Management</h1>
                <button
                    onClick={() => router.push(`/${tenantSlug}/vendor-payments/create`)}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                >
                    + Add Vendor Payment
                </button>
            </div>

            <DynamicTable
                key={refreshKey}
                title="Vendor Payments"
                fetchData={fetchVendorPayments}
                columns={columns}
            />
        </div>
    )
}
