import { ColumnDef } from '@/types/api'
import { Bonus } from '@/features/bonuses/types'

export function formatBonusDate(value?: string | null): string {
    if (!value) return 'N/A'
    return value.split('T')[0]
}

export function formatBonusAmount(value?: string | number | null): string {
    if (value === null || typeof value === 'undefined' || value === '') return 'N/A'
    const numericValue = typeof value === 'number' ? value : Number(value)
    if (Number.isNaN(numericValue)) return String(value)
    return numericValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

export function getBonusStatusBadge(status: string | number) {
    const s = String(status).toLowerCase()
    let badgeClass = 'bg-slate-100 text-slate-700'
    let badgeText = String(status)

    if (s === 'paid') {
        badgeClass = 'bg-emerald-100 text-emerald-700'
        badgeText = 'Paid'
    } else if (s === 'due') {
        badgeClass = 'bg-amber-100 text-amber-800'
        badgeText = 'Due'
    }

    return (
        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${badgeClass}`}>
            {badgeText}
        </span>
    )
}

export interface UseBonusColumnsOptions {
    tenantSlug: string
    onDelete?: (id: number | string) => void
}

export function useBonusColumns({
    tenantSlug,
    onDelete,
}: UseBonusColumnsOptions): ColumnDef<Bonus>[] {
    const columns: ColumnDef<Bonus>[] = [
        {
            header: '#',
            cell: (_item, index) => <span className="text-slate-500">{index + 1}</span>,
            className: 'w-12',
        },
        { header: 'Date', cell: (item) => <span>{formatBonusDate(item.date)}</span> },
        { header: 'Employee', cell: (item) => <span>{item.employee?.name || 'N/A'}</span> },
        { header: 'Salary Month', cell: (item) => <span>{item.salary_month || 'N/A'}</span> },
        {
            header: 'Bonus Amount',
            cell: (item) => <span className="font-medium">{formatBonusAmount(item.bonus_amount)}</span>,
        },
        {
            header: 'Status',
            cell: (item) => getBonusStatusBadge(item.status),
        },
    ]

    if (onDelete) {
        columns.push({
            header: 'Actions',
            className: 'text-right',
            cell: (item) => (
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => {
                            if (confirm(`Are you sure you want to delete this bonus for ${item.employee?.name || 'Employee'}?`)) {
                                onDelete(item.id)
                            }
                        }}
                        className="text-sm font-medium text-rose-600 hover:text-rose-900"
                    >
                        Delete
                    </button>
                </div>
            ),
        })
    }

    return columns
}
