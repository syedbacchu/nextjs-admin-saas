'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import DynamicTable from '@/components/ui/DynamicTable'
import TableActions from '@/components/ui/TableActions'
import { ColumnDef } from '@/types/api'
import { Attendance, AttendanceListResponse, getAttendancesAction, deleteAttendanceClient } from '@/features/attendances'
import { EmployeeService } from '@/features/employees'
import type { Employee } from '@/features/employees'
import FilterWithApply from '@/components/ui/FilterWithApply'
import MonthYearPicker from '@/components/ui/MonthYearPicker'

const EMPTY_ATTENDANCE_LIST: AttendanceListResponse = {
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

export default function AttendancesContent() {
    const router = useRouter()
    const params = useParams<{ tenant_slug?: string }>()
    const tenantSlug = String(params?.tenant_slug || '').trim()
    const [refreshKey, setRefreshKey] = useState(0)
    const [employees, setEmployees] = useState<Employee[]>([])
    const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({
        employee_id: '',
        month: '',
    })

    // Fetch filter options on mount
    useEffect(() => {
        const fetchFilterOptions = async () => {
            if (tenantSlug) {
                const employeesRes = await EmployeeService.getAll(tenantSlug)
                if (employeesRes.success && employeesRes.data) {
                    setEmployees(employeesRes.data)
                }
            }
        }
        fetchFilterOptions()
    }, [tenantSlug])

    const columns: ColumnDef<Attendance>[] = [
        {
            header: '#',
            cell: (_item, index) => <span className="text-slate-500">{index + 1}</span>,
            className: 'w-12',
        },
        { header: 'Date', cell: (item) => <span>{formatDate(item.date)}</span> },
        { header: 'Employee', cell: (item) => <span>{item.employee?.name || 'N/A'}</span> },
        { header: 'Month', cell: (item) => <span>{item.month || 'N/A'}</span> },
        { header: 'Working Day(s)', accessorKey: 'working_day' },
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
                    viewLink={`/${tenantSlug}/attendances/${item.id}`}
                    editLink={`/${tenantSlug}/attendances/${item.id}/edit`}
                    onDelete={handleDelete}
                    itemName={`Attendance for ${item.employee?.name || 'Employee'}`}
                    deleteTitle="Delete Attendance?"
                    deleteMessage="Are you sure you want to delete this attendance record? This action cannot be undone."
                />
            ),
        },
    ]

    async function fetchAttendances(page: number, search: string, filters: Record<string, string>) {
        if (!tenantSlug) return EMPTY_ATTENDANCE_LIST
        return getAttendancesAction(tenantSlug, page, search, {
            employee_id: filters.employee_id,
            month: filters.month,
        })
    }

    async function handleDelete(id: number | string) {
        if (!tenantSlug) {
            toast.error('Invalid tenant')
            return
        }

        const res = await deleteAttendanceClient(tenantSlug, id)

        if (res.success) {
            toast.success(res.message || 'Attendance deleted successfully')
            setRefreshKey((prev) => prev + 1)
        } else {
            toast.error(res.message || 'Failed to delete attendance')
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Attendance Management</h1>
                <button
                    onClick={() => router.push(`/${tenantSlug}/attendances/create`)}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                >
                    + Add Attendance
                </button>
            </div>

            <DynamicTable
                key={refreshKey}
                title="Attendances"
                fetchData={fetchAttendances}
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
                            setAppliedFilters({ employee_id: '', month: '' })
                            setRefreshKey((prev) => prev + 1)
                        }}
                        filtersGridClassName="md:grid-cols-2"
                        renderFilters={({ filters: pendingFilters, onChange }) => (
                            <>
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-700">
                                        Month
                                    </label>
                                    <MonthYearPicker
                                        value={pendingFilters.month || ''}
                                        onChange={(value) => onChange('month', value)}
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
                            </>
                        )}
                    />
                )}
            />
        </div>
    )
}
