import { getAllEmployeesAction } from '@/features/employees'
import AdvanceSalaryForm from "@/features/advance-salaries/components/AdvanceSalaryForm";

interface CreateAdvanceSalaryPageProps {
    params: Promise<{
        tenant_slug: string
    }> | {
        tenant_slug: string
    }
}

export default async function CreateAdvanceSalaryPage({ params }: CreateAdvanceSalaryPageProps) {
    const resolvedParams = await params
    const tenantSlug = String(resolvedParams?.tenant_slug || '').trim()

    if (!tenantSlug) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                Invalid tenant route.
            </div>
        )
    }

    const employeesRes = await getAllEmployeesAction(tenantSlug)
    const employees = (employeesRes.success && Array.isArray(employeesRes.data)) ? employeesRes.data : []

    return (
        <AdvanceSalaryForm
            tenantSlug={tenantSlug}
            employees={employees}
            submitLabel="Create Advance Salary"
        />
    )
}
