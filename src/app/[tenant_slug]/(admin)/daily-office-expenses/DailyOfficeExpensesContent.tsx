'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import DynamicTable from '@/components/ui/DynamicTable'
import TableActions from '@/components/ui/TableActions'
import { ColumnDef } from '@/types/api'
import {
    DailyOfficeExpense,
    DailyOfficeExpenseListResponse,
    getDailyOfficeExpensesAction,
    deleteDailyOfficeExpenseClient,
    DailyOfficeExpenseOfficeSummary,
} from '@/features/daily-office-expenses'
import { OfficeService } from '@/features/offices'
import FilterWithApply from '@/components/ui/FilterWithApply'

const EMPTY_DAILY_OFFICE_EXPENSE_LIST: DailyOfficeExpenseListResponse = {
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

const CATEGORY_OPTIONS = [
    { label: 'Utility', value: 'utility' },
    { label: 'Rent', value: 'rent' },
    { label: 'Fuel', value: 'fuel' },
    { label: 'Maintenance', value: 'maintenance' },
    { label: 'Internet', value: 'internet' },
    { label: 'Stationery', value: 'stationery' },
]

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

export default function DailyOfficeExpensesContent() {
    const router = useRouter()
    const params = useParams<{ tenant_slug?: string }>()
    const tenantSlug = String(params?.tenant_slug || '').trim()
    const [refreshKey, setRefreshKey] = useState(0)
    const [offices, setOffices] = useState<DailyOfficeExpenseOfficeSummary[]>([])
    const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({
        office_id: '',
        category: '',
    })

    // Fetch offices on mount
    useEffect(() => {
        const fetchOffices = async () => {
            if (tenantSlug) {
                const res = await OfficeService.list(tenantSlug, 1, '')
                if (res.success && res.data?.data) {
                    setOffices(res.data.data)
                }
            }
        }
        fetchOffices()
    }, [tenantSlug])

    const columns: ColumnDef<DailyOfficeExpense>[] = [
        {
            header: '#',
            cell: (_item, index) => <span className="text-slate-500">{index + 1}</span>,
            className: 'w-12',
        },
        { header: 'Date', cell: (item) => <span>{formatDate(item.date)}</span> },
        { header: 'Paid To', accessorKey: 'paid_to' },
        { header: 'Category', accessorKey: 'category' },
        { header: 'Office', cell: (item) => <span>{item.office?.branch_name || (item.office_id ? `#${item.office_id}` : 'N/A')}</span> },
        { header: 'Amount', cell: (item) => <span>{formatAmount(item.amount)}</span> },
        { header: 'Remarks', cell: (item) => <span>{item.remarks || 'N/A'}</span> },
        {
            header: 'Attachment',
            cell: (item) => (
                item.attachment ? (
                    <a href={item.attachment} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800">
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
                    viewLink={`/${tenantSlug}/daily-office-expenses/${item.id}`}
                    editLink={`/${tenantSlug}/daily-office-expenses/${item.id}/edit`}
                    onDelete={handleDelete}
                    itemName={`Office Expense of ${formatAmount(item.amount)}`}
                    deleteTitle="Delete Daily Office Expense?"
                    deleteMessage="Are you sure you want to delete this daily office expense? This action cannot be undone."
                />
            ),
        },
    ]

    async function fetchDailyOfficeExpenses(page: number, search: string, filters: Record<string, string>) {
        if (!tenantSlug) return EMPTY_DAILY_OFFICE_EXPENSE_LIST
        return getDailyOfficeExpensesAction(tenantSlug, page, search, {
            office_id: filters.office_id,
            category: filters.category,
        })
    }

    async function handleDelete(id: number | string) {
        if (!tenantSlug) {
            toast.error('Invalid tenant')
            return
        }

        const res = await deleteDailyOfficeExpenseClient(tenantSlug, id)

        if (res.success) {
            toast.success(res.message || 'Daily office expense deleted successfully')
            setRefreshKey((prev) => prev + 1)
        } else {
            toast.error(res.message || 'Failed to delete daily office expense')
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Office Expense Management</h1>
                <button
                    onClick={() => router.push(`/${tenantSlug}/daily-office-expenses/create`)}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                >
                    + Add Office Expense
                </button>
            </div>

            <DynamicTable
                key={refreshKey}
                title="Daily Office Expenses"
                fetchData={fetchDailyOfficeExpenses}
                columns={columns}
                initialFilters={appliedFilters}
                renderFilters={({ filters, onFilterChange }) => (
                    <FilterWithApply
                        initialFilters={filters}
                        onApply={(newFilters) => {
                            setAppliedFilters(newFilters)
                            setRefreshKey((prev) => prev + 1)
                        }}
                        onReset={() => {
                            setAppliedFilters({
                                office_id: '',
                                category: '',
                            })
                            setRefreshKey((prev) => prev + 1)
                        }}
                        renderFilters={({ filters: pendingFilters, onChange }) => (
                            <>
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-700">
                                        Office
                                    </label>
                                    <select
                                        value={pendingFilters.office_id || ''}
                                        onChange={(e) => onChange('office_id', e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                                    >
                                        <option value="">All Offices</option>
                                        {offices.map((office) => (
                                            <option key={office.id} value={String(office.id)}>
                                                {office.branch_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-700">
                                        Category
                                    </label>
                                    <select
                                        value={pendingFilters.category || ''}
                                        onChange={(e) => onChange('category', e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                                    >
                                        <option value="">All Categories</option>
                                        {CATEGORY_OPTIONS.map((category) => (
                                            <option key={category.value} value={category.value}>
                                                {category.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                    />
                )}
            />
        </div>
    )
}
