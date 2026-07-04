'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import DynamicTable from '@/components/ui/DynamicTable'
import TableActions from '@/components/ui/TableActions'
import { ColumnDef } from '@/types/api'
import { Bonus, BonusListResponse, deleteBonusClient, getBonusesAction } from '@/features/bonuses'
import { EmployeeService } from '@/features/employees'
import { OfficeService } from '@/features/offices'
import type { Employee } from '@/features/employees'
import type { Office } from '@/features/offices'
import FilterWithApply from '@/components/ui/FilterWithApply'
import MonthYearPicker from '@/components/ui/MonthYearPicker'

const EMPTY_BONUS_LIST: BonusListResponse = {
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

export default function BonusesContent() {
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

    const columns: ColumnDef<Bonus>[] = [
        {
            header: '#',
            cell: (_item, index) => <span className="text-slate-500">{index + 1}</span>,
            className: 'w-12',
        },
        { header: 'Date', cell: (item) => <span>{formatDate(item.date)}</span> },
        { header: 'Employee', cell: (item) => <span>{item.employee?.name || 'N/A'}</span> },
        { header: 'Salary Month', cell: (item) => <span>{item.salary_month || 'N/A'}</span> },
        { header: 'Bonus Amount', cell: (item) => <span className="font-medium">{formatAmount(item.bonus_amount)}</span> },
        {
            header: 'Status',
            cell: (item) => (
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    item.status === 'paid'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                }`}>
                    {item.status === 'due' ? 'Due' : item.status === 'paid' ? 'Paid' : 'Inactive'}
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
                    viewLink={`/${tenantSlug}/bonuses/${item.id}`}
                    editLink={`/${tenantSlug}/bonuses/${item.id}/edit`}
                    onDelete={handleDelete}
                    itemName={`Bonus for ${item.employee?.name || 'Employee'}`}
                    deleteTitle="Delete Bonus?"
                    deleteMessage="Are you sure you want to delete this bonus record? This action cannot be undone."
                />
            ),
        },
    ]

    async function fetchBonuses(page: number, search: string, filters: Record<string, string>) {
        if (!tenantSlug) return EMPTY_BONUS_LIST
        return getBonusesAction(tenantSlug, page, search, {
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

        const res = await deleteBonusClient(tenantSlug, id)

        if (res.success) {
            toast.success(res.message || 'Bonus deleted successfully')
            setRefreshKey((prev) => prev + 1)
        } else {
            toast.error(res.message || 'Failed to delete bonus')
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Bonus Management</h1>
                <button
                    onClick={() => router.push(`/${tenantSlug}/bonuses/create`)}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                >
                    + Add Bonus
                </button>
            </div>

            <DynamicTable
                key={refreshKey}
                title="Bonuses"
                fetchData={fetchBonuses}
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
