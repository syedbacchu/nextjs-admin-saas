import { EmployeeForm, getEmployeeAction } from '@/features/employees'
import { getFilesAction } from '@/features/files'

interface EditEmployeePageProps {
    params: Promise<{
        tenant_slug: string
        id: string
    }> | {
        tenant_slug: string
        id: string
    }
}

export default async function EditEmployeePage({ params }: EditEmployeePageProps) {
    const resolvedParams = await params
    const tenantSlug = String(resolvedParams?.tenant_slug || '').trim()
    const employeeId = String(resolvedParams?.id || '').trim()

    if (!tenantSlug || !employeeId) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                Invalid employee route.
            </div>
        )
    }

    const [res, filesRes] = await Promise.all([
        getEmployeeAction(tenantSlug, employeeId),
        getFilesAction(tenantSlug, 1, ''),
    ])

    if (!res.success || !res.data) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <h1 className="text-lg font-bold text-red-700">Failed to load employee</h1>
                <p className="mt-1 text-sm text-red-600">{res.message || 'Something went wrong.'}</p>
            </div>
        )
    }

    const initialFiles = filesRes.success ? filesRes.data?.data || [] : []

    return (
        <EmployeeForm
            tenantSlug={tenantSlug}
            employeeId={employeeId}
            initialData={res.data}
            initialFiles={initialFiles}
            submitLabel="Update Employee"
        />
    )
}
