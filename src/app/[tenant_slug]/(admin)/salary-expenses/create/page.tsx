import { getAllEmployeesAction } from '@/features/employees'
import { getFilesAction } from '@/features/files'
import { getOfficesAction } from '@/features/offices'
import {SalaryExpenseForm} from "@/features/salary-expenses";

interface CreateSalaryExpensePageProps {
    params: Promise<{
        tenant_slug: string
    }> | {
        tenant_slug: string
    }
}

export default async function CreateSalaryExpensePage({ params }: CreateSalaryExpensePageProps) {
    const resolvedParams = await params
    const tenantSlug = String(resolvedParams?.tenant_slug || '').trim()

    if (!tenantSlug) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                Invalid tenant route.
            </div>
        )
    }

    const [employeesRes, officesRes, filesRes] = await Promise.all([
        getAllEmployeesAction(tenantSlug),
        getOfficesAction(tenantSlug, 1, ''),
        getFilesAction(tenantSlug, 1, ''),
    ])

    const employees = (employeesRes.success && Array.isArray(employeesRes.data)) ? employeesRes.data : []
    const offices = officesRes.success ? officesRes.data?.data || [] : []
    const initialFiles = filesRes.success ? filesRes.data?.data || [] : []

    return (
        <SalaryExpenseForm
            tenantSlug={tenantSlug}
            employees={employees}
            offices={offices}
            initialFiles={initialFiles}
            submitLabel="Create Monthly Salary"
        />
    )
}
