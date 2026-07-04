import { getAllEmployeesAction } from '@/features/employees'
import { getFilesAction } from '@/features/files'
import { getOfficesAction } from '@/features/offices'
import {getSalaryExpenseAction, SalaryExpenseForm} from '@/features/salary-expenses'

interface EditSalaryExpensePageProps {
    params: Promise<{
        tenant_slug: string
        id: string
    }> | {
        tenant_slug: string
        id: string
    }
}

export default async function EditSalaryExpensePage({ params }: EditSalaryExpensePageProps) {
    const resolvedParams = await params
    const tenantSlug = String(resolvedParams?.tenant_slug || '').trim()
    const expenseId = String(resolvedParams?.id || '').trim()

    if (!tenantSlug || !expenseId) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                Invalid monthly salary route.
            </div>
        )
    }

    const [res, employeesRes, officesRes, filesRes] = await Promise.all([
        getSalaryExpenseAction(tenantSlug, expenseId),
        getAllEmployeesAction(tenantSlug),
        getOfficesAction(tenantSlug, 1, ''),
        getFilesAction(tenantSlug, 1, ''),
    ])

    if (!res.success || !res.data) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <h1 className="text-lg font-bold text-red-700">Failed to load monthly salary</h1>
                <p className="mt-1 text-sm text-red-600">{res.message || 'Something went wrong.'}</p>
            </div>
        )
    }

    const employees = (employeesRes.success && Array.isArray(employeesRes.data)) ? employeesRes.data : []
    const offices = officesRes.success ? officesRes.data?.data || [] : []
    const initialFiles = filesRes.success ? filesRes.data?.data || [] : []

    return (
        <SalaryExpenseForm
            tenantSlug={tenantSlug}
            expenseId={expenseId}
            initialData={res.data}
            employees={employees}
            offices={offices}
            initialFiles={initialFiles}
            submitLabel="Update Monthly Salary"
        />
    )
}
