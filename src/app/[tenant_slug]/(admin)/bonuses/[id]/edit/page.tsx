import { getBonusAction } from '@/features/bonuses'
import { getAllEmployeesAction } from '@/features/employees'
import BonusForm from "@/features/bonuses/components/BonusForm";

interface EditBonusPageProps {
    params: Promise<{
        tenant_slug: string
        id: string
    } | {
        tenant_slug: string
        id: string
    }>
}

export default async function EditBonusPage({ params }: EditBonusPageProps) {
    const resolvedParams = await params
    const tenantSlug = String(resolvedParams?.tenant_slug || '').trim()
    const bonusId = String(resolvedParams?.id || '').trim()

    if (!tenantSlug || !bonusId) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                Invalid bonus route.
            </div>
        )
    }

    const [res, employeesRes] = await Promise.all([
        getBonusAction(tenantSlug, bonusId),
        getAllEmployeesAction(tenantSlug),
    ])

    if (!res.success || !res.data) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <h1 className="text-lg font-bold text-red-700">Failed to load bonus</h1>
                <p className="mt-1 text-sm text-red-600">{res.message || 'Something went wrong.'}</p>
            </div>
        )
    }

    const employees = (employeesRes.success && Array.isArray(employeesRes.data)) ? employeesRes.data : []

    return (
        <BonusForm
            tenantSlug={tenantSlug}
            employees={employees}
            bonusId={bonusId}
            initialData={res.data}
            submitLabel="Update Bonus"
        />
    )
}
