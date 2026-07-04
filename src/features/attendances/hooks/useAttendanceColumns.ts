import { ColumnDef } from '@/types/api'
import { Attendance } from '@/features/attendances/types'

export function formatAttendanceDate(value?: string | null): string {
    if (!value) return 'N/A'
    return value.split('T')[0]
}

export function getAttendanceStatusBadge(status: number | string) {
    const s = String(status)
    const isActive = s === '1'

    return (
        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
            isActive
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-100 text-slate-700'
        }`}>
            {isActive ? 'Active' : 'Inactive'}
        </span>
    )
}

export interface UseAttendanceColumnsOptions {
    tenantSlug: string
    onDelete?: (id: number | string) => void
}

export function useAttendanceColumns({
    tenantSlug,
    onDelete,
}: UseAttendanceColumnsOptions): ColumnDef<Attendance>[] {
    const columns: ColumnDef<Attendance>[] = [
        {
            header: '#',
            cell: (_item, index) => <span className="text-slate-500">{index + 1}</span>,
            className: 'w-12',
        },
        { header: 'Date', cell: (item) => <span>{formatAttendanceDate(item.date)}</span> },
        { header: 'Employee', cell: (item) => <span>{item.employee?.name || 'N/A'}</span> },
        { header: 'Working Day', cell: (item) => <span>{item.working_day}</span> },
        { header: 'Month', cell: (item) => <span>{item.month || 'N/A'}</span> },
        {
            header: 'Status',
            cell: (item) => getAttendanceStatusBadge(item.status),
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
                            if (confirm(`Are you sure you want to delete this attendance for ${item.employee?.name || 'Employee'}?`)) {
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
