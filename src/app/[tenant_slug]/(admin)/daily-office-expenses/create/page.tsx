import { DailyOfficeExpenseForm } from '@/features/daily-office-expenses'
import { getFilesAction } from '@/features/files'
import { getOfficesAction } from '@/features/offices'

interface CreateDailyOfficeExpensePageProps {
    params: Promise<{
        tenant_slug: string
    }> | {
        tenant_slug: string
    }
}

export default async function CreateDailyOfficeExpensePage({ params }: CreateDailyOfficeExpensePageProps) {
    const resolvedParams = await params
    const tenantSlug = String(resolvedParams?.tenant_slug || '').trim()

    if (!tenantSlug) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                Invalid tenant route.
            </div>
        )
    }

    const [officesRes, filesRes] = await Promise.all([
        getOfficesAction(tenantSlug, 1, ''),
        getFilesAction(tenantSlug, 1, ''),
    ])

    const offices = officesRes.success ? officesRes.data?.data || [] : []
    const initialFiles = filesRes.success ? filesRes.data?.data || [] : []

    return (
        <DailyOfficeExpenseForm
            tenantSlug={tenantSlug}
            offices={offices}
            initialFiles={initialFiles}
            submitLabel="Create Office Expense"
        />
    )
}
