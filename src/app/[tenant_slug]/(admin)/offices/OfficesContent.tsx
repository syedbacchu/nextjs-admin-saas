'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import DynamicTable from '@/components/ui/DynamicTable'
import TableActions from '@/components/ui/TableActions'
import { ColumnDef } from '@/types/api'
import { getOfficesAction, deleteOfficeClient, Office, OfficeListResponse } from '@/features/offices'

const EMPTY_OFFICE_LIST: OfficeListResponse = {
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

function formatBalance(value?: string | number | null): string {
    if (value === null || typeof value === 'undefined' || value === '') return 'N/A'
    const numericValue = typeof value === 'number' ? value : Number(value)
    if (Number.isNaN(numericValue)) return String(value)
    return numericValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

export default function OfficesContent() {
    const router = useRouter()
    const params = useParams<{ tenant_slug?: string }>()
    const tenantSlug = String(params?.tenant_slug || '').trim()
    const [refreshKey, setRefreshKey] = useState(0)

    const columns: ColumnDef<Office>[] = [
        {
            header: '#',
            cell: (_item, index) => <span className="text-slate-500">{index + 1}</span>,
            className: 'w-12',
        },
        { header: 'Branch Name', accessorKey: 'branch_name' },
        { header: 'Opening Balance', cell: (item) => <span>{formatBalance(item.opening_balance)}</span> },
        { header: 'Address', cell: (item) => <span>{item.address || 'N/A'}</span> },
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
                    viewLink={`/${tenantSlug}/offices/${item.id}`}
                    editLink={`/${tenantSlug}/offices/${item.id}/edit`}
                    onDelete={handleDelete}
                    itemName={item.branch_name}
                    deleteTitle="Delete Office?"
                    deleteMessage="Are you sure you want to delete this office? This action cannot be undone and all associated data will be permanently removed."
                />
            ),
        },
    ]

    async function fetchOffices(page: number, search: string) {
        if (!tenantSlug) return EMPTY_OFFICE_LIST
        return getOfficesAction(tenantSlug, page, search)
    }

    async function handleDelete(id: number | string) {
        if (!tenantSlug) {
            toast.error('Invalid tenant')
            return
        }

        const res = await deleteOfficeClient(tenantSlug, id)

        if (res.success) {
            toast.success(res.message || 'Office deleted successfully')
            setRefreshKey((prev) => prev + 1)
        } else {
            toast.error(res.message || 'Failed to delete office')
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Office Management</h1>
                <button
                    onClick={() => router.push(`/${tenantSlug}/offices/create`)}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                >
                    + Add Office
                </button>
            </div>

            <DynamicTable
                key={refreshKey}
                title="Offices"
                fetchData={fetchOffices}
                columns={columns}
            />
        </div>
    )
}
