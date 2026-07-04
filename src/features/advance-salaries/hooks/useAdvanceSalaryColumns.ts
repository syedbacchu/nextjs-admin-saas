import { ColumnDef } from '@/types/api'
import { AdvanceSalary } from '@/features/advance-salaries/types'

export function formatAdvanceSalaryDate(value?: string | null): string {
    if (!value) return 'N/A'
    return value.split('T')[0]
}

export function formatAdvanceSalaryAmount(value?: string | number | null): string {
    if (value === null || typeof value === 'undefined' || value === '') return 'N/A'
    const numericValue = typeof value === 'number' ? value : Number(value)
    if (Number.isNaN(numericValue)) return String(value)
    return numericValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

export function getAdvanceSalaryStatusBadge(status: string | number) {
    const s = String(status).toLowerCase()
    let badgeClass = 'bg-slate-100 text-slate-700'
    let badgeText = String(status)

    if (s === 'due') {
        badgeClass = 'bg-amber-100 text-amber-800'
        badgeText = 'Due'
    } else if (s === 'paid') {
        badgeClass = 'bg-emerald-100 text-emerald-700'
        badgeText = 'Paid'
    }

    return (
        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${badgeClass}`}>
            {badgeText}
        </span>
    )
}

export interface UseAdvanceSalaryColumnsOptions {
    tenantSlug: string
    onDelete?: (id: number | string) => void
}

export function useAdvanceSalaryColumns({
    tenantSlug,
    onDelete,
}: UseAdvanceSalaryColumnsOptions): ColumnDef<AdvanceSalary>[] {
    const columns: ColumnDef<AdvanceSalary>[] = [
        {
            header: '#',
            cell: (_item, index) => <span className="text-slate-500">{index + 1}</span>,
            className: 'w-12',
        },
        { header: 'Date', cell: (item) => <span>{formatAdvanceSalaryDate(item.date)}</span> },
        { header: 'Employee', cell: (item) => <span>{item.employee?.name || 'N/A'}</span> },
        { header: 'Salary Month', cell: (item) => <span>{item.salary_month || 'N/A'}</span> },
        {
            header: 'Advance Amount',
            cell: (item) => <span className="font-medium">{formatAdvanceSalaryAmount(item.advance_amount)}</span>,
        },
        {
            header: 'Status',
            cell: (item) => getAdvanceSalaryStatusBadge(item.status),
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
                            if (confirm(`Are you sure you want to delete this advance salary for ${item.employee?.name || 'Employee'}?`)) {
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
