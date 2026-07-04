'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import DynamicTable from '@/components/ui/DynamicTable'
import { deleteVendorClient, getVendorsAction, VendorListResponse } from '@/features/vendors'
import { useVendorColumns } from '@/features/vendors/hooks/useVendorColumns'

const EMPTY_VENDOR_LIST: VendorListResponse = {
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

export default function VendorsListPage() {
    const router = useRouter()
    const params = useParams<{ tenant_slug?: string }>()
    const tenantSlug = String(params?.tenant_slug || '').trim()
    const [refreshKey, setRefreshKey] = useState(0)

    async function handleDelete(id: number | string) {
        if (!tenantSlug) {
            toast.error('Invalid tenant')
            return
        }

        const res = await deleteVendorClient(tenantSlug, id)

        if (res.success) {
            toast.success(res.message || 'Vendor deleted successfully')
            setRefreshKey((prev) => prev + 1)
        } else {
            toast.error(res.message || 'Failed to delete vendor')
        }
    }

    const columns = useVendorColumns(tenantSlug, handleDelete)

    async function fetchVendors(page: number, search: string) {
        if (!tenantSlug) return EMPTY_VENDOR_LIST
        return getVendorsAction(tenantSlug, page, search)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Vendor Management</h1>
                <button
                    onClick={() => router.push(`/${tenantSlug}/vendors/create`)}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                >
                    + Add Vendor
                </button>
            </div>

            <DynamicTable
                key={refreshKey}
                title="Vendors"
                fetchData={fetchVendors}
                columns={columns}
            />
        </div>
    )
}
