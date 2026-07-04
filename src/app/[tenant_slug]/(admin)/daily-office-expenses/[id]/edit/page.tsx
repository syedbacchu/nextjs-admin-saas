import {DailyOfficeExpenseForm, getDailyOfficeExpenseAction} from '@/features/daily-office-expenses'
import { getFilesAction } from '@/features/files'
import { getOfficesAction } from '@/features/offices'

interface EditDailyOfficeExpensePageProps {
    params: Promise<{
        tenant_slug: string
        id: string
    }> | {
        tenant_slug: string
        id: string
    }
}

export default async function EditDailyOfficeExpensePage({ params }: EditDailyOfficeExpensePageProps) {
    const resolvedParams = await params
    const tenantSlug = String(resolvedParams?.tenant_slug || '').trim()
    const expenseId = String(resolvedParams?.id || '').trim()

    if (!tenantSlug || !expenseId) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                Invalid office expense route.
            </div>
        )
    }

    const [res, officesRes, filesRes] = await Promise.all([
        getDailyOfficeExpenseAction(tenantSlug, expenseId),
        getOfficesAction(tenantSlug, 1, ''),
        getFilesAction(tenantSlug, 1, ''),
    ])

    if (!res.success || !res.data) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <h1 className="text-lg font-bold text-red-700">Failed to load office expense</h1>
                <p className="mt-1 text-sm text-red-600">{res.message || 'Something went wrong.'}</p>
            </div>
        )
    }

    const offices = officesRes.success ? officesRes.data?.data || [] : []
    const initialFiles = filesRes.success ? filesRes.data?.data || [] : []

    return (
        <DailyOfficeExpenseForm
            tenantSlug={tenantSlug}
            expenseId={expenseId}
            initialData={res.data}
            offices={offices}
            initialFiles={initialFiles}
            submitLabel="Update Office Expense"
        />
    )
}
