'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import DynamicTable from '@/components/ui/DynamicTable'
import TableActions from '@/components/ui/TableActions'
import { ColumnDef } from '@/types/api'
import { getSalaryExpensesAction, deleteSalaryExpenseClient, SalaryExpense, SalaryExpenseListResponse } from '@/features/salary-expenses'
import { EmployeeService } from '@/features/employees'
import { OfficeService } from '@/features/offices'
import type { Employee } from '@/features/employees'
import type { Office } from '@/features/offices'
import FilterWithApply from '@/components/ui/FilterWithApply'
import MonthYearPicker from '@/components/ui/MonthYearPicker'

const EMPTY_SALARY_EXPENSE_LIST: SalaryExpenseListResponse = {
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

function formatAmount(value?: string | number | null): string {
    if (value === null || typeof value === 'undefined' || value === '') return 'N/A'
    const numericValue = typeof value === 'number' ? value : Number(value)
    if (Number.isNaN(numericValue)) return String(value)
    return numericValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

export default function SalaryExpensesContent() {
    const router = useRouter()
    const params = useParams<{ tenant_slug?: string }>()
    const tenantSlug = String(params?.tenant_slug || '').trim()
    const [refreshKey, setRefreshKey] = useState(0)
    const [employees, setEmployees] = useState<Employee[]>([])
    const [offices, setOffices] = useState<Office[]>([])
    const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({
        employee_id: '',
        office_id: '',
        salary_month: '',
    })

    // Fetch filter options on mount
    useEffect(() => {
        const fetchFilterOptions = async () => {
            if (tenantSlug) {
                const [employeesRes, officesRes] = await Promise.all([
                    EmployeeService.getAll(tenantSlug),
                    OfficeService.list(tenantSlug, 1, ''),
                ])

                if (employeesRes.success && employeesRes.data) {
                    setEmployees(employeesRes.data)
                }
                if (officesRes.success && officesRes.data?.data) {
                    setOffices(officesRes.data.data)
                }
            }
        }
        fetchFilterOptions()
    }, [tenantSlug])

    const columns: ColumnDef<SalaryExpense>[] = [
        {
            header: '#',
            cell: (_item, index) => <span className="text-slate-500">{index + 1}</span>,
            className: 'w-12',
        },
        { header: 'Date', cell: (item) => <span>{formatDate(item.date)}</span> },
        { header: 'Salary Month', cell: (item) => <span>{item.salary_month || 'N/A'}</span> },
        { header: 'Paid To', cell: (item) => <span>{item.paid_to_user?.name || (item.paid_to_user_id ? `#${item.paid_to_user_id}` : 'N/A')}</span> },
        { header: 'Category', accessorKey: 'category' },
        { header: 'Office', cell: (item) => <span>{item.office?.branch_name || (item.office_id ? `#${item.office_id}` : 'N/A')}</span> },
        { header: 'Amount', cell: (item) => <span>{formatAmount(item.amount)}</span> },
        
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
                    hasDelete
                    viewLink={`/${tenantSlug}/salary-expenses/${item.id}`}
                    onDelete={handleDelete}
                    itemName={`Monthly Salary of ${formatAmount(item.amount)}`}
                    deleteTitle="Delete Monthly Salary?"
                    deleteMessage="Are you sure you want to delete this monthly salary? This action cannot be undone."
                />
            ),
        },
    ]

    async function fetchSalaryExpenses(page: number, search: string, filters: Record<string, string>) {
        if (!tenantSlug) return EMPTY_SALARY_EXPENSE_LIST
        return getSalaryExpensesAction(tenantSlug, page, search, {
            employee_id: filters.employee_id,
            office_id: filters.office_id,
            salary_month: filters.salary_month,
        })
    }

    async function handleDelete(id: number | string) {
        if (!tenantSlug) {
            toast.error('Invalid tenant')
            return
        }

        const res = await deleteSalaryExpenseClient(tenantSlug, id)

        if (res.success) {
            toast.success(res.message || 'Monthly salary deleted successfully')
            setRefreshKey((prev) => prev + 1)
        } else {
            toast.error(res.message || 'Failed to delete monthly salary')
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Monthly Salary Management</h1>
                <button
                    onClick={() => router.push(`/${tenantSlug}/salary-expenses/create`)}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                >
                    + Add Monthly Salary
                </button>
            </div>

            <DynamicTable
                key={refreshKey}
                title="Monthly Salary"
                fetchData={fetchSalaryExpenses}
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
                                employee_id: '',
                                office_id: '',
                                salary_month: '',
                            })
                            setRefreshKey((prev) => prev + 1)
                        }}
                        filtersGridClassName="md:grid-cols-3"
                        renderFilters={({ filters: pendingFilters, onChange }) => (
                            <>
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-700">
                                        Month
                                    </label>
                                    <MonthYearPicker
                                        value={pendingFilters.salary_month || ''}
                                        onChange={(value) => onChange('salary_month', value)}
                                        placeholder="Select Month"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-700">
                                        Employee
                                    </label>
                                    <select
                                        value={pendingFilters.employee_id || ''}
                                        onChange={(e) => onChange('employee_id', e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                                    >
                                        <option value="">All Employees</option>
                                        {employees.map((employee) => (
                                            <option key={employee.id} value={String(employee.id)}>
                                                {employee.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
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
                            </>
                        )}
                    />
                )}
            />
        </div>
    )
}
