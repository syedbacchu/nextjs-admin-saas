'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import DynamicTable from '@/components/ui/DynamicTable'
import TableActions from '@/components/ui/TableActions'
import { ColumnDef } from '@/types/api'
import { getDriversAction } from '@/services/driver/driver.actions'
import { deleteDriverClient } from '@/services/driver/driver.client'
import { Driver, DriverListResponse } from '@/services/driver/driver.types'

const EMPTY_DRIVER_LIST: DriverListResponse = {
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

function formatDate(value?: string | null): string {
    if (!value) return 'N/A'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'N/A'
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

export default function DriversPage() {
    const router = useRouter()
    const params = useParams<{ tenant_slug?: string }>()
    const tenantSlug = String(params?.tenant_slug || '').trim()
    const [refreshKey, setRefreshKey] = useState(0)

    const columns: ColumnDef<Driver>[] = [
        {
            header: '#',
            cell: (_item, index) => <span className="text-slate-500">{index + 1}</span>,
            className: 'w-12',
        },
        { header: 'Name', accessorKey: 'name' },
        { header: 'Phone', accessorKey: 'phone' },
        { header: 'License', accessorKey: 'license_no' },
        {
            header: 'Joining Date',
            cell: (item) => <span>{formatDate(item.joining_date)}</span>,
        },
        {
            header: 'Status',
            cell: (item) => (
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    item.status === 1
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                }`}>
                    {item.status === 1 ? 'Active' : 'Inactive'}
                </span>
            ),
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (item) => (
                <TableActions
                    id={item.id}
                    hasView
                    hasEdit
                    hasDelete
                    viewLink={`/${tenantSlug}/drivers/${item.id}`}
                    editLink={`/${tenantSlug}/drivers/${item.id}/edit`}
                    onDelete={handleDelete}
                />
            ),
        },
    ]

    async function fetchDrivers(page: number, search: string) {
        if (!tenantSlug) return EMPTY_DRIVER_LIST
        return getDriversAction(tenantSlug, page, search)
    }

    async function handleDelete(id: number | string) {
        if (!tenantSlug) {
            toast.error('Invalid tenant')
            return
        }

        const res = await deleteDriverClient(tenantSlug, id)

        if (res.success) {
            toast.success(res.message || 'Driver deleted successfully')
            setRefreshKey((prev) => prev + 1)
        } else {
            toast.error(res.message || 'Failed to delete driver')
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Driver Management</h1>
                <button
                    onClick={() => router.push(`/${tenantSlug}/drivers/create`)}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                >
                    + Add Driver
                </button>
            </div>

            <DynamicTable
                key={refreshKey}
                title="Drivers"
                fetchData={fetchDrivers}
                columns={columns}
            />
        </div>
    )
}
