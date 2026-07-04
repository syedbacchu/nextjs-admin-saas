import type { ColumnDef } from '@/types/api'
import type { DailyOfficeExpense } from '../types'

export function useDailyOfficeExpenseColumns(
    tenantSlug: string,
    handleDelete: (id: number | string) => void,
): ColumnDef<DailyOfficeExpense>[] {
    function formatDate(value?: string | null): string {
        if (!value) return 'N/A'
        return value.split('T')[0]
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

    return [
        {
            header: '#',
            cell: (_item, index) => <span className="text-slate-500">{index + 1}</span>,
            className: 'w-12',
        },
        { header: 'Date', cell: (item) => <span>{formatDate(item.date)}</span> },
        { header: 'Paid To', cell: (item) => <span>{item.paid_to || 'N/A'}</span> },
        { header: 'Category', cell: (item) => <span>{item.category || 'N/A'}</span> },
        { header: 'Office', cell: (item) => <span>{item.office?.branch_name || 'N/A'}</span> },
        { header: 'Amount', cell: (item) => <span className="font-medium">{formatAmount(item.amount)}</span> },
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
                <div className="flex justify-end gap-2">
                    <a
                        href={`/${tenantSlug}/daily-office-expenses/${item.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        View
                    </a>
                    <a
                        href={`/${tenantSlug}/daily-office-expenses/${item.id}/edit`}
                        className="text-emerald-600 hover:text-emerald-800 text-sm font-medium"
                    >
                        Edit
                    </a>
                    <button
                        onClick={() => {
                            if (confirm('Are you sure you want to delete this expense?')) {
                                handleDelete(item.id)
                            }
                        }}
                        className="text-rose-600 hover:text-rose-800 text-sm font-medium"
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ]
}
