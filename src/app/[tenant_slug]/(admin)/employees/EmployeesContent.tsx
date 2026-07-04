'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import DynamicTable from '@/components/ui/DynamicTable'
import ListImage from '@/components/ui/ListImage'
import TableActions from '@/components/ui/TableActions'
import { ColumnDef } from '@/types/api'
import {
    Employee,
    EmployeeListResponse,
    getEmployeesAction,
    deleteEmployeeClient,
} from '@/features/employees'

const EMPTY_EMPLOYEE_LIST: EmployeeListResponse = {
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

function formatAmount(value?: string | number | null): string {
    if (value === null || typeof value === 'undefined' || value === '') return 'N/A'
    const numericValue = typeof value === 'number' ? value : Number(value)
    if (Number.isNaN(numericValue)) return String(value)
    return numericValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

export default function EmployeesContent() {
    const router = useRouter()
    const params = useParams<{ tenant_slug?: string }>()
    const tenantSlug = String(params?.tenant_slug || '').trim()
    const [refreshKey, setRefreshKey] = useState(0)

    const columns: ColumnDef<Employee>[] = [
        {
            header: '#',
            cell: (_item, index) => <span className="text-slate-500">{index + 1}</span>,
            className: 'w-12',
        },
        {
            header: 'Image',
            className: 'w-20',
            cell: (item) => (
                <ListImage image={item.image} name={item.name} fallbackText="E" />
            ),
        },
        { header: 'Name', accessorKey: 'name' },
        { header: 'Mobile', accessorKey: 'mobile' },
        { header: 'Email', cell: (item) => <span>{item.email || 'N/A'}</span> },
        { header: 'Gender', cell: (item) => <span>{item.gender || 'N/A'}</span> },
        { header: 'Designation', cell: (item) => <span>{item.designation || 'N/A'}</span> },
        { header: 'Basic Salary', cell: (item) => <span>{formatAmount(item.basic_salary)}</span> },
        { header: 'Gross Salary', cell: (item) => <span>{formatAmount(item.gross_salary)}</span> },
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
                    viewLink={`/${tenantSlug}/employees/${item.id}`}
                    editLink={`/${tenantSlug}/employees/${item.id}/edit`}
                    onDelete={handleDelete}
                    itemName={item.name}
                    deleteTitle="Delete Employee?"
                    deleteMessage="Are you sure you want to delete this employee? This action cannot be undone."
                />
            ),
        },
    ]

    async function fetchEmployees(page: number, search: string) {
        if (!tenantSlug) return EMPTY_EMPLOYEE_LIST
        return getEmployeesAction(tenantSlug, page, search)
    }

    async function handleDelete(id: number | string) {
        if (!tenantSlug) {
            toast.error('Invalid tenant')
            return
        }

        const res = await deleteEmployeeClient(tenantSlug, id)

        if (res.success) {
            toast.success(res.message || 'Employee deleted successfully')
            setRefreshKey((prev) => prev + 1)
        } else {
            toast.error(res.message || 'Failed to delete employee')
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Employee Management</h1>
                <button
                    onClick={() => router.push(`/${tenantSlug}/employees/create`)}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                >
                    + Add Employee
                </button>
            </div>

            <DynamicTable
                key={refreshKey}
                title="Employees"
                fetchData={fetchEmployees}
                columns={columns}
            />
        </div>
    )
}
