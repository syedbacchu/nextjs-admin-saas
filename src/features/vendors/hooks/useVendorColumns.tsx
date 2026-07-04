'use client'

import TableActions from '@/components/ui/TableActions'
import { Vendor } from '@/features/vendors'
import { ColumnDef } from '@/types/api'

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

function formatBalance(value?: string | number | null): string {
    if (value === null || typeof value === 'undefined' || value === '') return 'N/A'
    const numericValue = typeof value === 'number' ? value : Number(value)
    if (Number.isNaN(numericValue)) return String(value)
    return numericValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

export function useVendorColumns(tenantSlug: string, handleDelete: (id: number | string) => void): ColumnDef<Vendor>[] {
    return [
        {
            header: '#',
            cell: (_item, index) => <span className="text-slate-500">{index + 1}</span>,
            className: 'w-12',
        },
        { header: 'Name', accessorKey: 'name' },
        { header: 'Mobile', accessorKey: 'mobile' },
        { header: 'Date', cell: (item) => <span>{formatDate(item.date)}</span> },
        { header: 'Category', cell: (item) => <span>{item.vehicle_category?.name || 'N/A'}</span> },
        { header: 'Work Area', cell: (item) => <span>{item.work_area || 'N/A'}</span> },
        { header: 'Opening Balance', cell: (item) => <span>{formatBalance(item.opening_balance)}</span> },
        {
            header: 'Status',
            cell: (item) => (
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${item.status === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
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
                    viewLink={`/${tenantSlug}/vendors/${item.id}`}
                    editLink={`/${tenantSlug}/vendors/${item.id}/edit`}
                    onDelete={handleDelete}
                    itemName={item.name}
                    deleteTitle="Delete Vendor?"
                    deleteMessage="Are you sure you want to delete this vendor? This action cannot be undone."
                />
            ),
        },
    ]
}
