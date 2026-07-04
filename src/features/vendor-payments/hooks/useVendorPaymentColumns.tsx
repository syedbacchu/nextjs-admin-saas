'use client'

import TableActions from '@/components/ui/TableActions'
import { VendorPayment } from '@/features/vendor-payments'
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

function formatAmount(value?: string | number | null): string {
    if (value === null || typeof value === 'undefined' || value === '') return 'N/A'
    const numericValue = typeof value === 'number' ? value : Number(value)
    if (Number.isNaN(numericValue)) return String(value)
    return numericValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

function formatPaymentMethod(value?: string | null): string {
    if (!value) return 'N/A'
    if (value === 'bank') return 'Bank'
    if (value === 'cash') return 'Cash'
    return value
}

export function useVendorPaymentColumns(tenantSlug: string, handleDelete: (id: number | string) => void): ColumnDef<VendorPayment>[] {
    return [
        {
            header: '#',
            cell: (_item, index) => <span className="text-slate-500">{index + 1}</span>,
            className: 'w-12',
        },
        { header: 'Date', cell: (item) => <span>{formatDate(item.date)}</span> },
        { header: 'Vendor', cell: (item) => <span>{item.vendor?.name || (item.vendor_id ? `#${item.vendor_id}` : 'N/A')}</span> },
        { header: 'Branch', cell: (item) => <span>{item.office?.branch_name || item.branch_name || (item.office_id ? `#${item.office_id}` : 'N/A')}</span> },
        { header: 'Bill Ref', cell: (item) => <span>{item.bill_ref || 'N/A'}</span> },
        { header: 'Amount', cell: (item) => <span>{formatAmount(item.amount)}</span> },
        { header: 'Payment Method', cell: (item) => <span>{formatPaymentMethod(item.payment_method)}</span> },
        { header: 'Note', cell: (item) => <span>{item.note || 'N/A'}</span> },
        {
            header: 'Bill',
            cell: (item) => (
                item.bill_document ? (
                    <a href={item.bill_document} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800">
                        View
                    </a>
                ) : (
                    <span>N/A</span>
                )
            ),
        },
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
                    viewLink={`/${tenantSlug}/vendor-payments/${item.id}`}
                    editLink={`/${tenantSlug}/vendor-payments/${item.id}/edit`}
                    onDelete={handleDelete}
                    itemName={`Payment to ${item.vendor?.name || 'Vendor'}`}
                    deleteTitle="Delete Vendor Payment?"
                    deleteMessage="Are you sure you want to delete this vendor payment? This action cannot be undone."
                />
            ),
        },
    ]
}
