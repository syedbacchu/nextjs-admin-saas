import { getAdvanceSalaryAction } from '@/features/advance-salaries'
import { getAllEmployeesAction } from '@/features/employees'
import AdvanceSalaryForm from "@/features/advance-salaries/components/AdvanceSalaryForm";

interface EditAdvanceSalaryPageProps {
    params: Promise<{
        tenant_slug: string
        id: string
    }> | {
        tenant_slug: string
        id: string
    }
}

export default async function EditAdvanceSalaryPage({ params }: EditAdvanceSalaryPageProps) {
    const resolvedParams = await params
    const tenantSlug = String(resolvedParams?.tenant_slug || '').trim()
    const advanceSalaryId = String(resolvedParams?.id || '').trim()

    if (!tenantSlug || !advanceSalaryId) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                Invalid advance salary route.
            </div>
        )
    }

    const [res, employeesRes] = await Promise.all([
        getAdvanceSalaryAction(tenantSlug, advanceSalaryId),
        getAllEmployeesAction(tenantSlug),
    ])

    if (!res.success || !res.data) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <h1 className="text-lg font-bold text-red-700">Failed to load advance salary</h1>
                <p className="mt-1 text-sm text-red-600">{res.message || 'Something went wrong.'}</p>
            </div>
        )
    }

    const employees = (employeesRes.success && Array.isArray(employeesRes.data)) ? employeesRes.data : []

    return (
        <AdvanceSalaryForm
            tenantSlug={tenantSlug}
            advanceSalaryId={advanceSalaryId}
            initialData={res.data}
            employees={employees}
            submitLabel="Update Advance Salary"
        />
    )
}
