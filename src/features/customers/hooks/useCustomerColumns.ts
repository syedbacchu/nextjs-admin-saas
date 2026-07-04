import { ColumnDef } from '@/types/api'
import { Customer } from '@/features/customers/types'

export function getCustomerStatusBadge(status: number) {
    const isActive = status === 1

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

export function getCustomerRateStatusBadge(rateStatus?: string | null) {
    const isFixed = rateStatus === 'fixed'

    return (
        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
            isFixed
                ? 'bg-blue-100 text-blue-700'
                : 'bg-purple-100 text-purple-700'
        }`}>
            {isFixed ? 'Fixed' : 'Dynamic'}
        </span>
    )
}

export interface UseCustomerColumnsOptions {
    tenantSlug: string
    onDelete?: (id: number | string) => void
}

export function useCustomerColumns({
    tenantSlug,
    onDelete,
}: UseCustomerColumnsOptions): ColumnDef<Customer>[] {
    const columns: ColumnDef<Customer>[] = [
        {
            header: '#',
            cell: (_item, index) => <span className="text-slate-500">{index + 1}</span>,
            className: 'w-12',
        },
        { header: 'Name', cell: (item) => <span className="font-medium">{item.name}</span> },
        { header: 'Mobile', cell: (item) => <span>{item.mobile || 'N/A'}</span> },
        { header: 'Email', cell: (item) => <span className="text-sm">{item.email || 'N/A'}</span> },
        {
            header: 'Rate Status',
            cell: (item) => getCustomerRateStatusBadge(item.rate_status),
        },
        {
            header: 'Status',
            cell: (item) => getCustomerStatusBadge(item.status),
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
                            if (confirm(`Are you sure you want to delete ${item.name}?`)) {
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
